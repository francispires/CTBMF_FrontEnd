import Chart, {Props} from "react-apexcharts";
import {useEffect, useState} from "react";
import {IRankingAnswersResponseDto} from "../../types_custom.ts";
import _ from "lodash";
import {eachWeekOfInterval, getDay, interval} from "date-fns";

const baseOptions: Props["options"] = {
    chart: {
        type: 'bar'
    },
    plotOptions: {
        bar: {
            horizontal: false
        },
    },
    dataLabels: {
        enabled: false
    },
    xaxis: {
        categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    },
    yaxis: {
        title: {
            text: 'Questões'
        }
    },
    fill: {
        opacity: 1
    },
    tooltip: {
        y: {
            formatter: function (val) {
                return val + " questões"
            }
        }
    }
};

export interface MyProps {
    myAnswers: IRankingAnswersResponseDto[]
}

interface SteamProps {
    color: string,
    name: string,
    data: number[]
}

export const DaySteam = ({myAnswers}: MyProps) => {

        const groupByDay = _.groupBy(myAnswers, a => {
            const date = new Date(a.createdAt || new Date());
            return getDay(date);
        });
        const days = [];
        const daysNames = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
        for (const [key, value] of Object.entries(groupByDay)) {
            const corrects = value.filter((answer: IRankingAnswersResponseDto) => answer.correct);
            const wrongs = value.filter((answer: IRankingAnswersResponseDto) => !answer.correct);
            const locale = "pt-BR";
            days.push({
                ...value[0],
                wrongs: wrongs.length,
                corrects: corrects.length,
                date: daysNames[key]
            });
        }

        const cats = days.map((d) => d.date);
        const corrects = days.map((week) => week.corrects);
        const wrongs = days.map((week) => week.wrongs);

        const [data, setData] = useState<SteamProps[]>();
        const [options, setOptions] = useState(baseOptions);
        useEffect(() => {
            const dd = [
                {
                    color: "#6dee7e",
                    fill:"green",
                    background:"green",
                    name: "Acertos",
                    data: corrects,
                },
                {
                    color: "#EE6D7A",
                    name: "Erros",
                    data: wrongs,
                }
            ];
            setData(dd);
            setOptions({...baseOptions, xaxis: {...baseOptions.xaxis, categories: cats}});
        }, []);
        return (
            <>
                <div className="w-full z-20">
                    <div id="chart">
                        {!data || (
                            <Chart options={options} series={data} type="bar" height={425}/>
                        )}
                    </div>
                </div>
            </>
        );
    }
;
