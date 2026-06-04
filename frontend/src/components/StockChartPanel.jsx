import { useState, useMemo, useEffect } from "react";
import Chart from "react-apexcharts";
import useStockStore from "../store/useStockStore";

export default function StockChartPanel({ stock }) {
  const [selectedPeriod, setSelectedPeriod] = useState("1D");
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const prices = useStockStore((state) => state.prices);
  const lastUpdate = useStockStore((state) => state.lastUpdate);
  const isConnected = useStockStore((state) => state.isConnected);

  // Get current price data from real-time prices
  const currentPriceData = useMemo(() => {
    if (!stock?.stockCode) return null;
    return prices[stock.stockCode] || null;
  }, [stock, prices]);

  // Simulate loading state
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [stock]);

  // Calculate price change
  const priceChange = useMemo(() => {
    if (!currentPriceData?.price || !currentPriceData?.previousClose) {
      return { amount: 0, percentage: 0, isPositive: false };
    }

    const amount = currentPriceData.price - currentPriceData.previousClose;
    const percentage = (amount / currentPriceData.previousClose) * 100;

    return {
      amount,
      percentage,
      isPositive: amount >= 0,
    };
  }, [currentPriceData]);

  // Generate chart data based on selected period
  const chartData = useMemo(() => {
    if (!currentPriceData?.price) {
      return { categories: [], series: [], type: "line" };
    }

    const currentPrice = currentPriceData.price;
    const previousClose = currentPriceData.previousClose || currentPrice;
    const dayHigh = currentPriceData.dayHigh || currentPrice * 1.02;
    const dayLow = currentPriceData.dayLow || currentPrice * 0.98;

    // Generate realistic price movements based on period
    const generateData = (points, volatility = 0.02) => {
      const data = [];
      const basePrice = previousClose;
      const targetPrice = currentPrice;
      const priceRange = targetPrice - basePrice;

      for (let i = 0; i < points; i++) {
        const progress = i / (points - 1);
        const trend = basePrice + priceRange * progress;
        const noise = (Math.random() - 0.5) * basePrice * volatility;
        const price = Math.max(
          dayLow * 0.95,
          Math.min(dayHigh * 1.05, trend + noise)
        );
        data.push(parseFloat(price.toFixed(2)));
      }

      // Ensure last point is current price
      data[data.length - 1] = currentPrice;
      return data;
    };

    switch (selectedPeriod) {
      case "1D": {
        const hours = Array.from({ length: 25 }, (_, i) => `${i}H`);
        return {
          categories: hours,
          series: generateData(25, 0.015),
          type: "line",
        };
      }
      case "1W": {
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
        return {
          categories: days,
          series: generateData(5, 0.025),
          type: "line",
        };
      }
      case "1M": {
        const dates = Array.from({ length: 30 }, (_, i) => `${i + 1}D`);
        return {
          categories: dates,
          series: generateData(30, 0.03),
          type: "line",
        };
      }
      case "3M": {
        const weeks = Array.from({ length: 12 }, (_, i) => `W${i + 1}`);
        return {
          categories: weeks,
          series: generateData(12, 0.04),
          type: "line",
        };
      }
      case "1Y": {
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        return {
          categories: months,
          series: generateData(12, 0.05),
          type: "line",
        };
      }
      case "ALL": {
        const years = ["2020", "2021", "2022", "2023", "2024", "2025", "2026"];
        return {
          categories: years,
          series: generateData(7, 0.08),
          type: "line",
        };
      }
      default:
        return { categories: [], series: [], type: "line" };
    }
  }, [currentPriceData, selectedPeriod]);

  // Calculate Y-axis range with 20% padding on top
  const yAxisConfig = useMemo(() => {
    if (!chartData.series.length) return { min: 0, max: 100, tickAmount: 4 };

    const minPrice = Math.min(...chartData.series);
    const maxPrice = Math.max(...chartData.series);
    const paddedMax = maxPrice * 1.2;

    // Generate 5 levels (0%, 25%, 50%, 75%, 100%)
    const range = paddedMax - minPrice;
    const levels = [
      Math.floor(minPrice),
      Math.floor(minPrice + range * 0.25),
      Math.floor(minPrice + range * 0.5),
      Math.floor(minPrice + range * 0.75),
      Math.floor(paddedMax),
    ];

    return {
      min: levels[0],
      max: levels[4],
      tickAmount: 4,
      labels: levels,
    };
  }, [chartData]);

  // ApexCharts options
  const chartOptions = useMemo(
    () => ({
      chart: {
        type: chartData.type,
        toolbar: { show: false },
        zoom: { enabled: false },
        background: "transparent",
        foreColor: "#9ca3af",
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800,
        },
        events: {
          click: (event, chartContext, config) => {
            if (config.dataPointIndex >= 0) {
              const price = chartData.series[config.dataPointIndex];
              const category = chartData.categories[config.dataPointIndex];
              setSelectedPoint({ price, category });
            }
          },
          mouseLeave: () => {
            setSelectedPoint(null);
          },
        },
      },
      theme: {
        mode: "dark",
      },
      stroke: {
        curve: "smooth",
        width: 2,
        colors: [priceChange.isPositive ? "#ef4444" : "#3b82f6"],
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "vertical",
          shadeIntensity: 0.5,
          gradientToColors: [priceChange.isPositive ? "#dc2626" : "#2563eb"],
          opacityFrom: 0.7,
          opacityTo: 0.3,
        },
      },
      grid: {
        borderColor: "#374151",
        strokeDashArray: 3,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
        padding: { top: 0, right: 20, bottom: 0, left: 10 },
      },
      xaxis: {
        categories: chartData.categories,
        labels: {
          show: true,
          style: { colors: "#6b7280", fontSize: "11px" },
          formatter: (value, index) => {
            // Show only first, middle, and last labels for cleaner look
            const total = chartData.categories.length;
            if (index === 0 || index === Math.floor(total / 2) || index === total - 1) {
              return value;
            }
            return "";
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
        tooltip: { enabled: false },
      },
      yaxis: {
        min: yAxisConfig.min,
        max: yAxisConfig.max,
        tickAmount: yAxisConfig.tickAmount,
        labels: {
          show: true,
          style: { colors: "#6b7280", fontSize: "11px" },
          formatter: (value) => Math.floor(value).toLocaleString(),
        },
      },
      tooltip: {
        enabled: true,
        theme: "dark",
        x: { show: true },
        y: {
          formatter: (value) => value?.toFixed(2),
          title: { formatter: () => "Price:" },
        },
        style: { fontSize: "12px" },
      },
      dataLabels: { enabled: false },
      legend: { show: false },
    }),
    [chartData, priceChange, yAxisConfig]
  );

  const series = useMemo(
    () => [
      {
        name: stock?.stockName || "Price",
        data: chartData.series,
      },
    ],
    [chartData, stock]
  );

  // Format last update time
  const formatLastUpdate = (timestamp) => {
    if (!timestamp) return "Never";

    const date = new Date(timestamp);
    
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (!stock) return null;

  // Loading state
  if (isLoading) {
    return (
      <div className="h-full rounded-2xl bg-white/5 border border-white/10 p-6 animate-pulse">
        <div className="h-8 bg-white/10 rounded w-1/3 mb-2"></div>
        <div className="h-12 bg-white/10 rounded w-1/2 mb-6"></div>
        <div className="h-10 bg-white/10 rounded w-full mb-4"></div>
        <div className="h-[400px] bg-white/10 rounded"></div>
      </div>
    );
  }

  // Error state
  if (!currentPriceData) {
    return (
      <div className="h-full rounded-2xl bg-white/5 border border-white/10 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-lg font-semibold mb-2">
            Unable to load chart data
          </div>
          <div className="text-gray-400 text-sm">
            Price information is currently unavailable
          </div>
        </div>
      </div>
    );
  }

  const periods = [
    { label: "1D", value: "1D" },
    { label: "1W", value: "1W" },
    { label: "1M", value: "1M" },
    { label: "3M", value: "3M" },
    { label: "1Y", value: "1Y" },
    { label: "ALL", value: "ALL" },
  ];

  return (
    <div className="h-full rounded-2xl bg-white/5 border border-white/10 p-6 flex flex-col">
      {/* Top Section - Stock Info */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white text-2xl font-bold">{stock.stockName}</h2>

          {/* Live Indicator */}
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500 animate-pulse" : "bg-gray-500"
              }`}
            />
            <span className="text-xs text-zinc-400">
              {isConnected ? "Live" : "Offline"}
            </span>
          </div>
        </div>

        <div className="flex items-baseline gap-3">
          <div className="text-white text-3xl font-bold transition-all duration-500">
            {selectedPoint
              ? selectedPoint.price.toFixed(2)
              : currentPriceData.price?.toLocaleString() || "-"}
            <span className="text-gray-400 text-lg ml-1">원</span>
          </div>

          {!selectedPoint && (
            <div
              className={`flex items-center gap-2 text-lg font-semibold transition-all duration-500 ${
                priceChange.isPositive ? "text-red-500" : "text-blue-500"
              }`}
            >
              <span>
                {priceChange.isPositive ? "+" : ""}
                {priceChange.amount.toFixed(2)}원
              </span>
              <span>
                ({priceChange.isPositive ? "+" : ""}
                {priceChange.percentage.toFixed(2)}%)
              </span>
            </div>
          )}

          {selectedPoint && (
            <div className="text-gray-400 text-sm">
              at {selectedPoint.category}
            </div>
          )}
        </div>

        {/* Last Update Time */}
        {lastUpdate && !selectedPoint && (
          <div className="text-xs text-zinc-500 mt-2">
            Updated: {formatLastUpdate(lastUpdate)}
          </div>
        )}
      </div>

      {/* Period Toolbar */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        {periods.map((period) => (
          <button
            key={period.value}
            onClick={() => setSelectedPeriod(period.value)}
            className={`
              px-4 py-2 rounded-lg font-medium text-sm
              transition-all duration-200 whitespace-nowrap
              ${
                selectedPeriod === period.value
                  ? "bg-white/20 text-white shadow-lg"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }
            `}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Chart Area */}
      <div className="flex-1 min-h-0">
        <Chart
          type={chartData.type}
          height="100%"
          options={chartOptions}
          series={series}
        />
      </div>
    </div>
  );
}

// Made with Bob
