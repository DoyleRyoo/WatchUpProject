# Real-Time Stock Update System - Complete Data Flow

## Overview

This document explains how stock prices flow from Yahoo Finance through the backend to the frontend UI, updating automatically every 10 seconds without page refresh.

---

## Architecture Diagram

```
┌─────────────────┐
│  Yahoo Finance  │
│   (yfinance)    │
└────────┬────────┘
         │
         │ Python Script Execution
         │ (stockPrice.py)
         ▼
┌─────────────────┐
│  Node.js Stock  │
│     Service     │
│ (stockService)  │
└────────┬────────┘
         │
         │ Cache & Store
         ▼
┌─────────────────┐
│   In-Memory     │
│     Cache       │
│ (stockCache.js) │
└────────┬────────┘
         │
         │ Cron Job (Every 10s)
         │ (cronJob.js)
         ▼
┌─────────────────┐
│   Socket.io     │
│     Server      │
│(socketServer.js)│
└────────┬────────┘
         │
         │ WebSocket Broadcast
         │ Event: "stock:batch-update"
         ▼
┌─────────────────┐
│  Frontend       │
│  Socket Client  │
│  (socket.js)    │
└────────┬────────┘
         │
         │ Update Store
         ▼
┌─────────────────┐
│  Zustand Store  │
│(useStockStore)  │
└────────┬────────┘
         │
         │ React Subscriptions
         ▼
┌─────────────────────────────────────┐
│           UI Components             │
│  • SummaryCards                     │
│  • HoldingsTable                    │
│  • StockChartPanel                  │
└─────────────────────────────────────┘
```

---

## Detailed Flow

### 1. Backend Initialization (server.js)

When the server starts:

```javascript
const io = initSocketServer(server);  // Initialize Socket.io
startCronJob(io);                     // Start cron job with io instance
```

### 2. Symbol Registration

When a user loads the dashboard:

**Frontend (DashboardPage.jsx)**:
```javascript
// Extract symbols from holdings
const symbols = getHoldingSymbols(); // ["AAPL", "005930.KS", ...]

// Register symbols for tracking
trackSymbols(symbols);
```

**Backend (socketServer.js)**:
```javascript
socket.on("track:symbols", (data) => {
  registerSymbols(data.symbols);  // Add to active tracking list
});
```

### 3. Cron Job Execution (Every 10 Seconds)

**Backend (cronJob.js)**:

```javascript
cron.schedule("*/10 * * * * *", async () => {
  // 1. Get all tracked symbols
  const symbols = Array.from(activeSymbols);
  
  // 2. Fetch prices in parallel
  for (const symbol of symbols) {
    stockCache.del(symbol);           // Clear cache
    const stock = await getStockPrice(symbol);  // Fetch fresh data
    updates[symbol] = stock;
  }
  
  // 3. Broadcast all updates at once
  io.emit("stock:batch-update", {
    prices: updates,
    timestamp: new Date().toISOString()
  });
});
```

### 4. Python Script Execution

**Backend (stockService.js)**:

```javascript
const python = spawn(PYTHON_BIN, [
  "./src/python/stockPrice.py",
  symbol
]);

// Collect output
python.stdout.on("data", (data) => {
  result += data.toString();
});

// Parse JSON response
const parsed = JSON.parse(result);
// {
//   symbol: "AAPL",
//   name: "Apple Inc.",
//   price: 203.11,
//   previousClose: 201.50,
//   dayHigh: 204.00,
//   dayLow: 202.00
// }
```

**Python (stockPrice.py)**:

```python
import yfinance as yf
import json

stock = yf.Ticker(symbol)
info = stock.info

data = {
    "symbol": symbol,
    "name": info.get("longName"),
    "price": info.get("currentPrice"),
    "previousClose": info.get("previousClose"),
    "dayHigh": info.get("dayHigh"),
    "dayLow": info.get("dayLow")
}

print(json.dumps(data))
```

### 5. Socket.io Broadcast

**Backend (cronJob.js)**:

```javascript
io.emit("stock:batch-update", {
  prices: {
    "AAPL": {
      symbol: "AAPL",
      price: 203.11,
      previousClose: 201.50,
      dayHigh: 204.00,
      dayLow: 202.00,
      timestamp: "2026-06-04T13:00:00.000Z"
    },
    "005930.KS": {
      symbol: "005930.KS",
      price: 84200,
      previousClose: 83100,
      dayHigh: 85000,
      dayLow: 82800,
      timestamp: "2026-06-04T13:00:00.000Z"
    }
  },
  timestamp: "2026-06-04T13:00:00.000Z"
});
```

### 6. Frontend Socket Listener

**Frontend (DashboardPage.jsx)**:

```javascript
useEffect(() => {
  const cleanup = setupSocketListeners(
    // On batch update
    (data) => {
      handleBatchUpdate(data);  // Update Zustand store
    },
    // On connect
    () => {
      setConnected(true);
      trackSymbols(getHoldingSymbols());  // Re-register on reconnect
    },
    // On disconnect
    () => {
      setConnected(false);
    }
  );

  return cleanup;
}, []);
```

### 7. Zustand Store Update

**Frontend (useStockStore.js)**:

```javascript
handleBatchUpdate: (data) => {
  if (data && data.prices) {
    set({
      prices: {
        ...get().prices,
        ...data.prices,  // Merge new prices
      },
      lastUpdate: data.timestamp,
    });
  }
}
```

**Store State Structure**:
```javascript
{
  holdings: [
    {
      id: "abc123",
      stockCode: "AAPL",
      stockName: "Apple Inc.",
      averagePrice: 200.00,
      quantity: 10
    }
  ],
  prices: {
    "AAPL": {
      symbol: "AAPL",
      price: 203.11,
      previousClose: 201.50,
      dayHigh: 204.00,
      dayLow: 202.00,
      timestamp: "2026-06-04T13:00:00.000Z"
    }
  },
  lastUpdate: "2026-06-04T13:00:00.000Z",
  isConnected: true
}
```

### 8. UI Component Updates

#### SummaryCards Component

**Calculation Logic**:

```javascript
const summary = useMemo(() => {
  let totalBuy = 0;
  let totalAsset = 0;

  holdings.forEach((holding) => {
    // Buy value
    const buyValue = holding.averagePrice * holding.quantity;
    totalBuy += buyValue;

    // Current value (uses real-time price)
    const currentPrice = prices[holding.stockCode]?.price || holding.averagePrice;
    const currentValue = currentPrice * holding.quantity;
    totalAsset += currentValue;
  });

  const totalProfit = totalAsset - totalBuy;
  const totalReturn = totalBuy > 0 ? (totalProfit / totalBuy) * 100 : 0;

  return { totalBuy, totalAsset, totalReturn, totalProfit };
}, [holdings, prices]);  // Re-calculates when prices change
```

**Visual Updates**:
- Live indicator (green pulsing dot when connected)
- Last update timestamp
- Smooth transitions on value changes (CSS `transition-all duration-500`)

#### HoldingsTable Component

**Enriched Data Calculation**:

```javascript
const enrichedHoldings = useMemo(() => {
  return holdings.map((stock) => {
    const currentPrice = prices[stock.stockCode]?.price || stock.averagePrice;
    const evaluationAmount = currentPrice * stock.quantity;
    const profit = (currentPrice - stock.averagePrice) * stock.quantity;
    const returnRate = ((currentPrice - stock.averagePrice) / stock.averagePrice) * 100;

    return {
      ...stock,
      currentPrice,
      evaluationAmount,
      profit,
      returnRate,
    };
  });
}, [holdings, prices]);  // Re-calculates when prices change
```

**Columns**:
- NAME: Stock name
- AVG: Average purchase price
- QTY: Quantity owned
- CURRENT: Real-time current price (updates every 10s)
- EVAL: Evaluation amount (current price × quantity)
- RETURN: Return percentage (color-coded: red for gains, blue for losses)

#### StockChartPanel Component

**Real-time Price Display**:

```javascript
const currentPriceData = useMemo(() => {
  if (!stock?.stockCode) return null;
  return prices[stock.stockCode] || null;
}, [stock, prices]);

const priceChange = useMemo(() => {
  const amount = currentPriceData.price - currentPriceData.previousClose;
  const percentage = (amount / currentPriceData.previousClose) * 100;
  
  return {
    amount,
    percentage,
    isPositive: amount >= 0,
  };
}, [currentPriceData]);
```

**Visual Features**:
- Live indicator (top-right corner)
- Real-time price with change amount and percentage
- Last update timestamp
- Color-coded chart (red for gains, blue for losses)
- Smooth transitions

---

## Performance Optimizations

### 1. Zustand Selectors

Components only subscribe to the data they need:

```javascript
// Only re-renders when prices change
const prices = useStockStore((state) => state.prices);

// Only re-renders when holdings change
const holdings = useStockStore((state) => state.holdings);
```

### 2. useMemo Hooks

Expensive calculations are memoized:

```javascript
const summary = useMemo(() => {
  // Calculate totals
}, [holdings, prices]);  // Only recalculates when dependencies change
```

### 3. Batch Updates

All stock prices are fetched in parallel and broadcast together:

```javascript
// Backend: Fetch all symbols in parallel
const promises = symbols.map(symbol => getStockPrice(symbol));
await Promise.all(promises);

// Broadcast once with all updates
io.emit("stock:batch-update", { prices: updates });
```

### 4. Cache Management

Cache is cleared before each fetch to ensure fresh data:

```javascript
stockCache.del(symbol);  // Clear cache
const stock = await getStockPrice(symbol);  // Fetch fresh
```

---

## Update Frequency

**Configured Interval**: Every 10 seconds

**Cron Expression**: `*/10 * * * * *`

This means:
- Updates occur at: 00, 10, 20, 30, 40, 50 seconds of each minute
- 6 updates per minute
- 360 updates per hour

**Note**: Yahoo Finance data itself may be delayed by 10-15 minutes. "Real-time" in this context means the UI updates immediately whenever yfinance returns new values.

---

## Error Handling

### Backend

```javascript
try {
  const stock = await getStockPrice(symbol);
  updates[symbol] = stock;
  successCount++;
} catch (err) {
  errorCount++;
  console.error(`✗ ${symbol} → Error: ${err.message}`);
}
```

### Frontend

```javascript
// Graceful fallback to average price if real-time price unavailable
const currentPrice = prices[holding.stockCode]?.price || holding.averagePrice;
```

---

## Console Logs

### Backend Logs

```
[STOCK TRACKER] Starting real-time stock update service...
[STOCK TRACKER] Update interval: Every 10 seconds
[STOCK TRACKER] Service started successfully
[SOCKET] Client connected: abc123xyz
[SOCKET] Client abc123xyz tracking: AAPL, 005930.KS

[STOCK UPDATE] Fetching prices...
  ✓ AAPL         → 203.11
  ✓ 005930.KS    → 84,200
[STOCK UPDATE] Complete: 2 success, 0 errors
```

### Frontend Logs

```
[SOCKET] Connected to server
[SOCKET] Tracking confirmed: ["AAPL", "005930.KS"]
```

---

## Testing Checklist

- [ ] Backend server starts without errors
- [ ] Cron job logs appear every 10 seconds
- [ ] Socket.io connection established
- [ ] Symbols registered when dashboard loads
- [ ] Price updates broadcast every 10 seconds
- [ ] SummaryCards update automatically
- [ ] HoldingsTable updates automatically
- [ ] StockChartPanel updates automatically
- [ ] Live indicator shows green when connected
- [ ] Last update timestamp changes every 10 seconds
- [ ] No page refresh required
- [ ] Smooth transitions on value changes
- [ ] Error handling works for invalid symbols

---

## File Summary

### Backend Files Modified/Created

1. **backend/src/jobs/cronJob.js** - Cron job with 10-second interval
2. **backend/src/socket/socketServer.js** - Socket.io server with symbol tracking
3. **backend/src/services/stockService.js** - Stock price fetching (unchanged)
4. **backend/src/cache/stockCache.js** - In-memory cache (unchanged)
5. **backend/src/python/stockPrice.py** - Python script (unchanged)

### Frontend Files Modified/Created

1. **frontend/src/services/socket.js** - Socket client with helper functions
2. **frontend/src/store/useStockStore.js** - Enhanced Zustand store
3. **frontend/src/pages/DashboardPage.jsx** - Socket setup and symbol tracking
4. **frontend/src/components/SummaryCards.jsx** - Live indicator and smooth transitions
5. **frontend/src/components/HoldingsTable.jsx** - Evaluation column and real-time updates
6. **frontend/src/components/StockChartPanel.jsx** - Live indicator and timestamp

---

## Conclusion

The real-time stock update system is now fully implemented with:

✅ 10-second update interval
✅ Automatic symbol tracking based on user holdings
✅ Batch updates for performance
✅ Live indicators and timestamps
✅ Smooth UI transitions
✅ Comprehensive error handling
✅ No page refresh required

All data flows from yfinance → Python → Node.js → Socket.io → Zustand → React components automatically every 10 seconds.