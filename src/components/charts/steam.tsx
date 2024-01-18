import Chart, { Props } from "react-apexcharts";

const state: Props["series"] = [
  {
    color: "green",
    name: "Acertos",
    data: [31, 40, 28, 51, 42, 56, 89],
  },
  {
    color: "red",
    name: "Erros",
    data: [11, 32, 45, 85, 34, 15, 41],
  },
];

const options: Props["options"] = {
  chart: {
    type: "area",
    animations: {
      easing: "linear",
      speed: 300,
    },
    sparkline: {
      enabled: false,
    },
    brush: {
      enabled: false,
    },
    id: "basic-bar",
    fontFamily: "Inter, sans-serif",
    foreColor: "hsl(var(--nextui-default-800))",
    stacked: false,
    toolbar: {
      show: false,
    },
  },
  xaxis: {
    categories: ["07/01", "14/01", "21/01", "28/01", "04/02", "11/02", "18/02"],
    labels: {
      // show: false,
      style: {
        colors: "hsl(var(--nextui-default-800))",
        fontFamily: "Inter, sans-serif",
      },
    },
    axisBorder: {
      color: "hsl(var(--nextui-nextui-default-200))",
    },
    axisTicks: {
      color: "hsl(var(--nextui-nextui-default-200))",
    },
  },
  yaxis: {
    labels: {
      style: {
        // hsl(var(--nextui-content1-foreground))
        colors: "hsl(var(--nextui-default-800))",
        fontFamily: "Inter, sans-serif",
      },
    },
  },
  tooltip: {
    enabled: false,
  },
  grid: {
    show: true,
    borderColor: "hsl(var(--nextui-default-200))",
    strokeDashArray: 0,
    position: "back",
  },
  stroke: {
    curve: "smooth",
    fill: {
      colors: ["red"],
    },
  },
  //markers: false,
};

export const Steam = () => {
  return (
    <>
      <div className="w-full z-20">
        <div id="chart">
          <Chart options={options} series={state} type="area" height={425} />
        </div>
      </div>
    </>
  );
};