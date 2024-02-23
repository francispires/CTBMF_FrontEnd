import { CardBalance2 } from "./card-balance2";
import { Steam } from "../charts/steam.tsx";
import { UserCard } from "../home/user-card.tsx";
import { MyCard } from "../layout/MyCard.tsx";
import { QuestionByDiscipline } from "../charts/question-by-discipline.tsx";
import { QuestionRight } from "../charts/question-right.tsx";
import { GeneralRank } from "../home/general-rank.tsx";

export const DashBoard = () => (
  <div className="h-full">
    <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0 flex-wrap xl:flex-nowrap max-w-[98rem] mx-auto w-full">
      <div className="mt-6 gap-6 flex flex-col w-full">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold">Você</h3>
          <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-2 gap-5  justify-center w-full">
            <MyCard>
              <UserCard />
            </MyCard>
            <MyCard className={"bg-danger-100"}>
              <CardBalance2 />
            </MyCard>
            <MyCard className="col-span-2">
              <GeneralRank />
            </MyCard>
          </div>
        </div>
        <div className="h-full flex flex-col gap-2">
          <h3 className="text-xl font-semibold">Desempenho Semanal</h3>
          <div className="w-full bg-default-50 shadow-lg rounded-2xl p-6 ">
            <Steam />
          </div>
        </div>
      </div>

      {/* Left Section */}
      <div className="mt-4 gap-2 flex flex-col xl:max-w-md w-full">
        <h3 className="text-xl font-semibold">Estudos</h3>
        <div className="flex flex-col justify-center gap-4 flex-wrap md:flex-nowrap md:flex-col">
          <MyCard>
            <QuestionByDiscipline />
          </MyCard>
          <MyCard>
            <QuestionRight />
          </MyCard>
        </div>
      </div>
    </div>
  </div>
);
