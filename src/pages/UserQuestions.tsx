import {QuestionsFilter} from "../components/questions-filter";
import {AnswerQuestion} from "../components/questions/answer-question.tsx";
import {useState} from "react";
import {get} from "../_helpers/api.ts";
import {useQuery} from "@tanstack/react-query";
import {QuestionResponseDto} from "../types_custom.ts";

export const UserQuestions = () => {
    const [board, setBoard] = useState("");
    const [institutionId, setInstitutionId] = useState("");
    const [discipline, setDiscipline] = useState("");
    const [year, setYear] = useState("");
    const [questionId, setQuestionId] = useState("");

    const fetchData = async () => {
        const apiUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL;
        const url = `${apiUrl}/${"questions/filter"}?board=${board}&institutionId=${institutionId}&discipline=${discipline}&year=${year}&questionId=${questionId}`;
        return await get<PagedResponse<QuestionResponseDto>>(url);
    }

    const hasFilter = board || institutionId || discipline || year || questionId;

    const {isLoading, data } = useQuery({
        queryKey: ['qryFilterQuestions'],
        queryFn: () => fetchData(),
        enabled: !!hasFilter
    });

    const filterChanged = () => {}

    return (
        <div className="my-5 max-w-[99rem] mx-auto w-full flex flex-col gap-10">
            <QuestionsFilter board={board} setBoard={setBoard}
                             year={year} setYear={setYear}
                             discipline={discipline} setDiscipline={setDiscipline}
                             institutionId={institutionId} setInstitutionId={setInstitutionId}
                             questionId={questionId} setQuestionId={setQuestionId}
                             FilterChanged={filterChanged}
            />
            {isLoading   && <div>Loading...</div>}
            {!isLoading && data!=undefined && (<AnswerQuestion question={data.queryable[0]}/>)}
        </div>
    );
}