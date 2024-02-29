import Chart, {Props} from "react-apexcharts";
import {useEffect, useState} from "react";
import {IRankingAnswersResponseDto} from "../../types_custom.ts";
import _ from "lodash";
import {eachWeekOfInterval, interval} from "date-fns";

const baseOptions: Props["options"] = {
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

export const Steam = ({myAnswers}: MyProps) => {

        const groupByWeek = _.groupBy(myAnswers, a => {
            const date = new Date(a.createdAt || new Date());
            const i = interval(date, new Date());
            const weeks = eachWeekOfInterval(i)
            return weeks[0].toISOString();
        });
        const weeks = [];
        for (const [key, value] of Object.entries(groupByWeek)) {
            const corrects = value.filter((answer: IRankingAnswersResponseDto) => answer.correct);
            const wrongs = value.filter((answer: IRankingAnswersResponseDto) => !answer.correct);
            const locale = "pt-BR";
            weeks.push({
                ...value[0],
                wrongs: wrongs.length,
                corrects: corrects.length,
                date: new Date(key).toLocaleString(locale, {dateStyle: "short"})
            });
        }

        const cats = weeks.map((week) => week.date);
        const corrects = weeks.map((week) => week.corrects);
        const wrongs = weeks.map((week) => week.wrongs);

        const [data, setData] = useState<SteamProps[]>();
        const [options, setOptions] = useState(baseOptions);
        useEffect(() => {
            const dd = [
                {
                    color: "green",
                    name: "Acertos",
                    data: corrects,
                },
                {
                    color: "red",
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
                            <Chart options={options} series={data} type="area" height={425}/>
                        )}
                    </div>
                </div>
            </>
        );
    }
;
