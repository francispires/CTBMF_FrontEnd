import Chart from "react-apexcharts";
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
                width: "100%"
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
    const corrects = myAnswers.filter((answer: IRankingAnswersResponseDto) => answer.correct).length;
    const total = corrects + wrongs;
    const correctsAndWrongs = [corrects, wrongs];

    return (
        <>
            {!correctsAndWrongs || (
                <>
                    {total == 0 || (
                        <Chart
                            options={baseState}
                            series={correctsAndWrongs}
                            type="donut"
                        />
                    )}
                    {total != 0 || (
                        <span className={"text-warning"}>Não há respostas</span>
                    )}
                </>
            )}
        </>
    );
};
