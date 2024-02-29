import {Community} from "../../components/icons/community.tsx";
import {IRankingAnswersResponseDto} from "../../types_custom.ts";
import {eachDayOfInterval, eachWeekOfInterval, interval} from "date-fns";
import _ from "lodash";

interface Props {
    myAnswers:IRankingAnswersResponseDto[]
}

export const WeekBalance = ({myAnswers}: Props) => {
    const thisWeekAnswers = myAnswers.filter((answer: IRankingAnswersResponseDto) => {
        const date = new Date(answer.createdAt || new Date());
        const i = interval(date, new Date());
        const weeks = eachWeekOfInterval(i)
        return weeks.length == 1;
    });
    const thisWeekSum = _.sumBy(thisWeekAnswers, 'questionScore');

    const todayAnswers = myAnswers.filter((answer: IRankingAnswersResponseDto) => {
        const date = new Date(answer.createdAt || new Date());
        const i = interval(date, new Date());
        const days = eachDayOfInterval(i)
        return days.length == 1;
    });
    const todaySum = _.sumBy(todayAnswers, 'questionScore');

    const openToday = todayAnswers.filter((answer: IRankingAnswersResponseDto) => !answer.quizAttemptId);
    const openTodaySum = _.sumBy(openToday, 'questionScore');
    const closedToday = todayAnswers.filter((answer: IRankingAnswersResponseDto) => answer.quizAttemptId);
    const closedTodaySum = _.sumBy(closedToday, 'questionScore');

    const yesterdayAnswers = myAnswers.filter((answer: IRankingAnswersResponseDto) => {
        const date = new Date(answer.createdAt || new Date());
        const i = interval(date, new Date());
        const days = eachDayOfInterval(i)
        return days.length > 1;
    });
    const yesterdaySum = _.sumBy(yesterdayAnswers, 'questionScore');
    const openYesterday = yesterdayAnswers.filter((answer: IRankingAnswersResponseDto) => !answer.quizAttemptId);
    const openYesterdaySum = _.sumBy(openYesterday, 'questionScore');
    const closedYesterday = yesterdayAnswers.filter((answer: IRankingAnswersResponseDto) => answer.quizAttemptId);
    const closedYesterdaySum = _.sumBy(closedYesterday, 'questionScore');

    const olderAnswers = myAnswers.filter((answer: IRankingAnswersResponseDto) => {
        const date = new Date(answer.createdAt || new Date());
        const i = interval(date, new Date());
        const days = eachWeekOfInterval(i)
        return days.length > 1;
    });
    const olderSum = _.sumBy(olderAnswers, 'questionScore');


    const weekDiff = thisWeekSum - olderSum;
    const weekPositive = weekDiff > 0;
    const todayDiff = todaySum - yesterdaySum;
    const todayPercent = (todayDiff / (yesterdaySum || 1)) * 100;

    const openDiff = openTodaySum - openYesterdaySum;
    const openPositive = openDiff > 0;
    const closedDiff = closedTodaySum - closedYesterdaySum;
    const closedPositive = closedDiff > 0;


    return (
        <div>
            <div className="flex gap-2.5">
                <Community/>
                <div className="flex flex-col">
                    <span className="text-default-900">Aproveitamento Semanal</span>
                    <span className="text-default-900 text-xs">{weekPositive ? "+" : ""} {weekDiff} Pontos</span>
                </div>
            </div>
            <div className="flex gap-2.5 py-2 items-center">
                Hoje
                <span className="text-default-900 text-xl font-semibold">
            {todaySum} <span className="text-default-900 text-xs">Pontos</span>
          </span>
                <span className="text-success text-xs">{todayPercent >= 0 ? "+" : ""} {todayPercent}%</span>
            </div>
            <div className="flex items-center gap-6">
                <div>
                    <div>
              <span className={"font-semibold text-xs " + (openPositive ? "text-success-600" : "text-danger-600")}>
                  {openPositive ? "↑" : "↓"}
              </span>
                        <span className="text-xs">{openDiff}</span>
                    </div>
                    <span className="text-default-900 text-xs">Questões Abertas</span>
                </div>

                <div>
                    <div>
                        <span
                            className={"font-semibold text-xs " + (closedPositive ? "text-success-600" : "text-danger-600")}>
                            {closedPositive ? "↑" : "↓"}
                        </span>
                        <span className="text-xs">{closedDiff}</span>
                    </div>
                    <span className="text-default-900 text-xs">Quizes</span>
                </div>

                {/*<div>*/}
                {/*    <div>*/}
                {/*        <span className="font-semibold text-danger text-xs">{"⭐"}</span>*/}
                {/*        <span className="text-xs">150</span>*/}
                {/*    </div>*/}
                {/*    <span className="text-default-900 text-xs">Especiais</span>*/}
                {/*</div>*/}
            </div>
        </div>
    );
};
