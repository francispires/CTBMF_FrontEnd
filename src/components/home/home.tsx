import { Link } from "@nextui-org/react";
import Calendar from "../calendar";
import {MyCard} from "../layout/MyCard.tsx";
import {QuestionRight} from "../charts/question-right.tsx";
import {UserCard} from "./user-card.tsx";
import React from "react";


export const Home = () => (
  <div className="h-full lg:px-6">
    <div className=" grid grid-cols-6 flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0 flex-wrap xl:flex-nowrap max-w-[98rem] mx-auto w-full">
      <div className="mt-6 col-span-4 gap-6 flex flex-col w-full">
          <h3 className="text-xl font-semibold">Agenda</h3>
          <MyCard>
            <Calendar />
          </MyCard>
      </div>
      <div className="mt-6 col-span-2 gap-6 flex flex-col ">
        <h3 className="text-xl font-semibold">Progresso</h3>
          <MyCard>
              <UserCard />
          </MyCard>
        <MyCard>
            <QuestionRight />
        </MyCard>
      </div>
    </div>
    <div className="flex flex-col justify-center w-full py-5 px-4 lg:px-0  max-w-[90rem] mx-auto gap-3">
      <div className="flex  flex-wrap justify-between">
        <h3 className="text-center text-xl font-semibold">Latest Users</h3>
        <Link
          href="/accounts"
          as={Link}
          color="primary"
          className="cursor-pointer"
        >
          View All
        </Link>
      </div>
    </div>
  </div>
);
