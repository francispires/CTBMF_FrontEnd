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

export const DashBoard = () => {
    const {user} = useAuth0();

    const filterMyAnswersOnly = (data: IRankingAnswersResponseDto[]) => {

        return data.filter((answer: IRankingAnswersResponseDto) => {
            return answer.userSid === user?.sub && answer.questionDisciplineParentName
        });
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
        <div className="grid
        sm:grid-cols-1 md:grid-cols-3
        gap-6
        sm:w-5/6
        md:w-full
        pt-3 px-4 lg:px-0 flex-wrap xl:flex-nowrap
        justify-center mx-auto w-full">
            <div className="flex flex-col md:col-span-2">
                <div className="flex flex-col">
                    <div className="justify-center xl:grid xl:grid-cols-2 gap-6">
                        <MyCard>
                            {!user || (
                                <UserCard myAnswers={answers}/>
                            )}
                        </MyCard>
                        <MyCard className={"bg-danger-100 md:my-0"}>
                            <WeekBalance myAnswers={answers}
                            />
                        </MyCard>
                        <MyCard className="col-span-2">
                            <GeneralRank/>
                        </MyCard>
                    </div>
                </div>
                <div className="justify-center gap-6">
                    <div className="w-full bg-default-50 shadow-lg rounded-2xl mt-6">
                        <Steam myAnswers={answers}/>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="flex flex-col justify-center gap-6 flex-wrap md:flex-nowrap md:flex-col">
                    <MyCard>
                        <QuestionRight myAnswers={answers}/>
                    </MyCard>
                    <MyCard>
                        <Worst myAnswers={answers}/>
                    </MyCard>
                </div>
            </div>
        </div>

    )
}