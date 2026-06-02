import yfinance as yf
import json
import sys

symbol = sys.argv[1]

try:
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

except Exception as e:
    print(json.dumps({
        "error": str(e)
    }))