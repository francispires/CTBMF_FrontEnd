import Chart, { } from "react-apexcharts";

const state = {
    series: [56,23],
    labels: ["Acertos", "Erros"],
    legend: {
        position: 'bottom' as "bottom" | "top" | "right" | "left" | undefined
    },
    colors: ['#27ae60', '#f31260'],
    responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: 200
            },
            legend: {
                position: 'bottom'
            }
        }
    }]
};

export const QuestionRight = () => {
    return (
        <>
            <div id="chart">
                <div className="flex gap-2.5 justify-center">
                    <div className="flex flex-col  py-2 px-6 rounded-xl">
                        <span className="text-default-900 text-xl font-semibold">
                          Aproveitamento Geral
                        </span>
                    </div>
                </div>
                <Chart
                    options={state}
                    series={state.series}
                    type="donut"
                />
            </div>
        </>
    );
};
