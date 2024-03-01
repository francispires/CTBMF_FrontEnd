import {WeekBalance} from "./week-balance.tsx";
import {Steam} from "../../components/charts/steam.tsx";
import {UserCard} from "../../components/home/user-card.tsx";
import {MyCard} from "../../components/layout/MyCard.tsx";
import {QuestionByDiscipline} from "../../components/charts/question-by-discipline.tsx";
import {QuestionRight} from "../../components/charts/question-right.tsx";
import {fetchRankingData, GeneralRank} from "../../components/home/general-rank.tsx";
import {useQuery} from "@tanstack/react-query";
import {PageLoader} from "../../components/page-loader.tsx";
import {useAuth0} from "@auth0/auth0-react";

export const DashBoard = () => {
    const {user} = useAuth0();

    const {isLoading, isError, data: answers} = useQuery({
        queryKey: ['ranking'],
        queryFn: fetchRankingData
    });

    if (isLoading || !answers)
        return <PageLoader></PageLoader>

    if (isError)
        return <div>Ocorreu um erro ao buscar os dados.</div>

    return (

        <div
            className="flex justify-center gap-2 xl:gap-6 pt-3 px-4 lg:px-0 flex-wrap xl:flex-nowrap max-w-[99rem] mx-auto w-full">
            <div className="flex flex-col w-full">
                <div className="flex flex-col">
                    <h3 className="text-xl font-semibold">Você</h3>
                    <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-2 gap-5  justify-center w-full">
                        <MyCard>
                            {!user || (
                                <UserCard myAnswers={answers}/>
                            )}
                        </MyCard>
                        <MyCard className={"bg-danger-100"}>
                            <WeekBalance myAnswers={answers}
                            />
                        </MyCard>
                        <MyCard className="col-span-2">
                            <GeneralRank/>
                        </MyCard>
                    </div>
                </div>
                <div className="h-full flex flex-col gap-2">
                    <h3 className="text-xl font-semibold">Desempenho Semanal</h3>
                    <div className="w-full bg-default-50 shadow-lg rounded-2xl p-6 ">
                        <Steam myAnswers={answers}/>
                    </div>
                </div>
            </div>

            {/* Left Section */}
            <div className="mt-4 gap-2 flex flex-col xl:max-w-md w-full">
                <h3 className="text-xl font-semibold">Estudos</h3>
                <div className="flex flex-col justify-center gap-4 flex-wrap md:flex-nowrap md:flex-col">
                    <MyCard>
                        <QuestionByDiscipline myAnswers={answers}/>
                    </MyCard>
                    <MyCard>
                        <QuestionRight myAnswers={answers}/>
                    </MyCard>
                </div>
            </div>
        </div>

    )
}