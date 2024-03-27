import {WeekBalance} from "./week-balance.tsx";
import {Steam} from "../../components/charts/steam.tsx";
import {UserCard} from "../../components/home/user-card.tsx";
import {MyCard} from "../../components/layout/MyCard.tsx";
import {QuestionRight} from "../../components/charts/question-right.tsx";
import {GeneralRank} from "../../components/home/general-rank.tsx";
import {useQuery} from "@tanstack/react-query";
import {PageLoader} from "../../components/page-loader.tsx";
import {useAuth0} from "@auth0/auth0-react";
import {Worst} from "../../components/charts/worst.tsx";
import {fetchRankingData} from "../../_helpers/api.ts";
import {IRankingAnswersResponseDto} from "../../types_custom.ts";
import {DaySteam} from "../../components/charts/daySteam.tsx";
import {QuestionByDiscipline} from "../../components/charts/question-by-discipline.tsx";
import {ChartWrap} from "../../components/layout/ChartWrap.tsx";

export const Reports = () => {
    const {user} = useAuth0();

    const filterMyAnswersOnly = (data: IRankingAnswersResponseDto[]) => {
        return data.filter((answer: IRankingAnswersResponseDto) => answer.userSid === user?.sub && answer.questionDisciplineParentName);
    }

    const {isLoading, isError, data: answers} = useQuery({
        queryKey: ['ranking'],
        queryFn: fetchRankingData,
        select: filterMyAnswersOnly
    });
    if (isLoading || !answers)
        return <PageLoader></PageLoader>

    if (isError)
        return <div>Ocorreu um erro ao buscar os dados.</div>

    return (

        <div className="grid grid-cols-3 justify-center gap-2 xl:gap-6 pt-3 px-4 lg:px-0 flex-wrap xl:flex-nowrap max-w-[99rem] mx-auto w-full">
            <div className="flex flex-col col-span-3">
                <div className="flex flex-col">
                    <h3 className="text-xl font-semibold">Relatórios</h3>
                    <div className="grid md:grid-cols-3 grid-cols-1 2xl:grid-cols-3 gap-5  justify-center w-full">
                        <MyCard>
                            <ChartWrap title={"Questões por dia"}>
                                <DaySteam myAnswers={answers}/>
                            </ChartWrap>

                        </MyCard>
                        <MyCard>
                            <ChartWrap title={"Aproveitamento"}>
                                <QuestionRight myAnswers={answers}/>
                            </ChartWrap>
                        </MyCard>
                        <MyCard>
                            <ChartWrap title={"Distribuição do Estudo"}>
                                <QuestionByDiscipline myAnswers={answers}/>
                            </ChartWrap>
                        </MyCard>
                       
                        <MyCard>
                            <Worst myAnswers={answers}/>
                        </MyCard>
                    </div>
                </div>
            </div>

            {/* Left Section */}
            <div className="flex flex-col">
                <h3 className="text-xl font-semibold">Estudos</h3>
                <div className="flex flex-col justify-center gap-4 flex-wrap md:flex-nowrap md:flex-col">

                </div>
            </div>
        </div>

    )
}