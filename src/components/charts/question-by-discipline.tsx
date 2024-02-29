import Chart from "react-apexcharts";
import {useEffect, useState} from "react";
import {IRankingAnswersResponseDto} from "../../types_custom.ts";
import _ from "lodash";

const baseState = {
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

export interface MyProps {
    myAnswers: IRankingAnswersResponseDto[]
}
export const QuestionByDiscipline = ({myAnswers}:MyProps) => {
    const disciplines = _.toArray(_.groupBy(myAnswers, a => a.questionDisciplineParentName));
    const groupDiscipline = disciplines.map((userAnswers: IRankingAnswersResponseDto[]) => {
        const corrects = userAnswers.filter((answer: IRankingAnswersResponseDto) => answer.correct);
        const wrongs = userAnswers.filter((answer: IRankingAnswersResponseDto) => !answer.correct);
        return {
            discipline: userAnswers[0].questionDisciplineParentName,
            corrects: corrects.length,
            wrongs: wrongs.length
        };
    });

    const disciplineCats = groupDiscipline.map((d) => d.discipline ? d.discipline : "Sem Disciplina");
    const allDisciplines = groupDiscipline.map((d) => d.corrects + d.wrongs);
    const [options, setOptions] = useState(baseState);
    useEffect(() => {
        setOptions({...baseState,options: {...baseState.options,labels: disciplineCats},series: allDisciplines});
    }, []);
    return (
        <>
            <div id="chart">
                <h3>Distribuição de estudo</h3>
                {!options || (
                <Chart
                    options={options.options}
                    series={options.series}
                    type="donut"
                />
                )}
            </div>
        </>
    );
};
