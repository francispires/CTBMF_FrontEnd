import { QuestionsFilter } from "./questions-filter";
import { AnswerQuestion } from "./questions/answer-question.tsx";
import { useEffect, useState } from "react";
import { get } from "../_helpers/api.ts";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {AnswerResponseDto, QuestionResponseDto} from "../types_custom.ts";
import {addParams, apiUrl} from "../_helpers/utils.ts";

export const UserQuestions = () => {
    const [boards, setBoards] = useState([""]);
    const [institutionIds, setInstitutionIds] = useState([""]);
    const [disciplines, setDisciplines] = useState([""]);
    const [subDisciplines, setSubDisciplines] = useState([""]);
    const [years, setYears] = useState([""]);
    const [triggerFilter, setTriggerFilter] = useState(false);

    const [questionNumber, setQuestionNumber] = useState<number | undefined>();
    const [onlyAnswereds, setOnlyAnswereds] = useState<boolean | undefined>();
    const [onlyNotAnswereds, setOnlyNotAnswereds] = useState<boolean | undefined>();
    const [onlyCorrects, setOnlyCorrects] = useState<boolean | undefined>();
    const [onlyWrongs, setOnlyWrongs] = useState<boolean | undefined>();
    const [random, setRandom] = useState<boolean | undefined>();
    const [url, setUrl] = useState("");
    const queryClient = useQueryClient();
    useEffect(() => {
        const u = new URL(`${apiUrl}/questions/filter`);
        addParams(u, "boards", boards);
        addParams(u, "institutionIds", institutionIds);
        addParams(u, "disciplines", disciplines);
        addParams(u, "subdisciplines", subDisciplines);
        addParams(u, "years", years);
        if (typeof onlyAnswereds != "undefined") u.searchParams.append("onlyanswereds", onlyAnswereds.toString());
        if (typeof onlyCorrects != "undefined") u.searchParams.append("onlycorrects", onlyCorrects.toString());
        if (typeof onlyNotAnswereds != "undefined") u.searchParams.append("onlynotanswereds", onlyNotAnswereds.toString());
        if (typeof onlyWrongs != "undefined") u.searchParams.append("onlywrongs", onlyWrongs.toString());
        if (typeof random != "undefined") u.searchParams.append("random", random.toString());
        if (typeof questionNumber != "undefined") u.searchParams.append("questionNumber", questionNumber?.toString());
        setUrl(u.toString());
    }, [boards, institutionIds, disciplines, years, onlyAnswereds, onlyCorrects,onlyNotAnswereds,onlyWrongs, random, questionNumber,subDisciplines])

    const fetchData = async () => {
        const r = await get<PagedResponse<QuestionResponseDto>>(url);
        setTriggerFilter(false);
        return r;
    }

    const { isLoading, data } = useQuery({
        queryKey: ['qryFilterQuestions', url],
        queryFn: () => fetchData(),
        enabled: !!triggerFilter
    });

    const filterChanged = () => {
        setTriggerFilter(true);
    }

    const onAnswer = async () => {
        await queryClient.invalidateQueries({queryKey: ['qryFilterQuestions', url]});
        filterChanged();
    };

    return (
        <div className="my-5 max-w-[99rem] mx-auto w-full flex flex-col gap-10">
            <QuestionsFilter
                onlyAnswereds={onlyAnswereds}
                setOnlyAnswereds={setOnlyAnswereds}
                onlyNotAnswereds={onlyNotAnswereds}
                setOnlyNotAnswereds={setOnlyNotAnswereds}
                onlyCorrects={onlyCorrects}
                setOnlyCorrects={setOnlyCorrects}
                onlyWrongs={onlyWrongs}
                setOnlyWrongs={setOnlyWrongs}
                random={random}
                setRandom={setRandom}
                boards={boards} setBoards={setBoards}
                years={years} setYears={setYears}
                disciplines={disciplines} setDisciplines={setDisciplines}
                subDisciplines={subDisciplines} setSubDisciplines={setSubDisciplines}
                institutionIds={institutionIds} setInstitutionIds={setInstitutionIds}
                questionNumber={questionNumber} setQuestionNumber={setQuestionNumber}
                FilterChanged={filterChanged}
            />
            {isLoading && <div>Carregando...</div>}
            {data && data.queryable.length === 0 && !isLoading && <div>Não existem mais questões a responder</div>}
            {!isLoading && data != undefined && data.queryable[0] && (<AnswerQuestion
                questionLoading={isLoading}
                quizAttemptId={""}
                onAnswer={onAnswer}
                question={data.queryable[0]} />)}
        </div>
    );
}