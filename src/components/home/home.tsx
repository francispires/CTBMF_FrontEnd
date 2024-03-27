import Calendar from "../calendar";
import {MyCard} from "../layout/MyCard.tsx";
import {GeneralRank} from "./general-rank.tsx";

export const Home = () => (

    <div
        className="flex justify-center gap-2 xl:gap-6 pt-3 px-4 lg:px-0 flex-wrap xl:flex-nowrap max-w-[99rem] mx-auto w-full">
        <div className="gap-2 flex flex-col w-full">
            <h3 className="text-xl font-semibold">Agenda</h3>
            <MyCard>
                <Calendar/>
            </MyCard>
        </div>
        <div className="gap-2 flex flex-col xl:max-w-md w-full">
            <h3 className="text-xl font-semibold">Ranking</h3>
            <MyCard>
                <GeneralRank/>
            </MyCard>
        </div>
    </div>
);
