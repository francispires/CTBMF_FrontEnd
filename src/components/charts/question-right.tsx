import Chart, {} from "react-apexcharts";
import {IRankingAnswersResponseDto} from "../../types_custom.ts";

const baseState = {
    series: [56, 23],
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

export interface MyProps {
    myAnswers: IRankingAnswersResponseDto[]
}

export const QuestionRight = ({myAnswers}: MyProps) => {
    const wrongs = myAnswers.filter((answer: IRankingAnswersResponseDto) => !answer.correct).length;
    const corrects = myAnswers.filter((answer: IRankingAnswersResponseDto) => !answer.correct).length;
    const correctsAndWrongs = [corrects, wrongs];
    // const [_, setSeries] = useState(baseState.series);
    // useEffect(() => {
    //     //setSeries(correctsAndWrongs);
    // }, []);
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
                {!correctsAndWrongs || (
                    <Chart
                        options={baseState}
                        series={correctsAndWrongs}
                        type="donut"
                    />
                )}
            </div>
        </>
    );
};
