import Calendar from "../calendar";
import { MyCard } from "../layout/MyCard.tsx";
import { QuestionRight } from "../charts/question-right.tsx";
import { UserCard } from "./user-card.tsx";
import { GeneralRank } from "./general-rank.tsx";

export const Home = () => (
    <div className="h-full lg:px-6">
        <div
            className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0 flex-wrap xl:flex-nowrap max-w-[98rem] mx-auto w-full">
            <div className="mt-6 gap-6 flex flex-col w-full">
                <h3 className="text-xl font-semibold">Agenda</h3>
                <MyCard>
                    <Calendar />
                </MyCard>
            </div>
            <div className="mt-4 gap-2 flex flex-col xl:max-w-md w-full">
                <h3 className="text-xl font-semibold">Progresso</h3>
                <MyCard>
                    <UserCard />
                </MyCard>
                <MyCard>
                    <GeneralRank />
                </MyCard>
                <MyCard>
                    <QuestionRight />
                </MyCard>
            </div>
        </div>
    </div>
);
