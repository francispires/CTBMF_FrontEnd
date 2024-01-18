import Chart from "react-apexcharts";

const state = {
    options: {
        chart: {
            id: "basic-bar",
            stacked: true,
            stackType: 'normal' as "normal" | "100%" | undefined,
            height: 350
        },
        formatter: function (val: any) {
            return val + "%"
        },
        legend: {
            position: "bottom" as "bottom" | "top" | "right" | "left" | undefined,
        },
        xaxis: {
            labels: {
                formatter: function (value = "") {
                    return value + "$";
                }
            },
        },
       labels: ["Disciplina 1", "Disciplina 2", "Disciplina 3", "Disciplina 4", "Disciplina 5"]
    },
    series: [56,23,45,12,34],
};

export const QuestionByDiscipline = () => {
    return (
        <>
            <div id="chart">
                <h3>Distribuição de estudo</h3>
                <Chart
                    options={state.options}
                    series={state.series}
                    type="donut"
                />
            </div>
        </>
    );
};
