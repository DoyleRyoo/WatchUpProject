import Chart from "react-apexcharts";

export default function StockChartPanel({
  stock,
}) {
  if (!stock) return null;

  const options = {
    theme: {
      mode: "dark",
    },

    chart: {
      toolbar: {
        show: false,
      },
    },

    stroke: {
      curve: "smooth",
    },

    xaxis: {
      categories: [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
      ],
    },
  };

  const series = [
    {
      name: stock.stockName,
      data: [100, 120, 115, 150, 170],
    },
  ];

  return (
    <div
      className="
      h-full
      rounded-2xl
      bg-white/5
      border
      border-white/10
      p-4
      "
    >
      <h2
        className="
        text-white
        text-xl
        font-bold
        mb-4
        "
      >
        {stock.stockName}
      </h2>

      <Chart
        type="line"
        height={400}
        options={options}
        series={series}
      />
    </div>
  );
}