import {QuestionsFilter} from "./questions-filter";
import {AnswerQuestion} from "./questions/answer-question.tsx";
import {useEffect, useState} from "react";
import {get} from "../_helpers/api.ts";
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
    const [next, setNext] = useState<boolean | undefined>();
    const [nextTick, setNextTick] = useState<number>(0);
    const [oldQuestionNumber, setOldQuestionNumber] = useState<number| undefined>();

    const [url, setUrl] = useState("");
    const [question, setQuestion] = useState<QuestionResponseDto>();
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
        if (typeof next != "undefined" && next) {
            u.searchParams.append("next", next.toString());
            if (next)u.searchParams.append("oldQuestionNumber", question?.questionNumber?.toString());
        }
        if (typeof questionNumber != "undefined") u.searchParams.append("questionNumber", questionNumber?.toString());
        setUrl(u.toString());
    }, [question,boards, institutionIds, disciplines, years, onlyAnswereds, onlyCorrects, onlyNotAnswereds, onlyWrongs, random, subDisciplines,oldQuestionNumber])

    const fetchData = async () => {
        const r = await get<PagedResponse<QuestionResponseDto>>(url);
        setTriggerFilter(false);
        setQuestion(r.queryable[0])

        return r;
    }

    const {isLoading, data} = useQuery({
        queryKey: ['qryFilterQuestions', url],
        queryFn: () => fetchData(),
        enabled: !!triggerFilter
    });

    const filterChanged = () => {
        setTriggerFilter(true);
    }

    const onAnswer = async (answer:AnswerResponseDto|null) => {
        await queryClient.invalidateQueries({queryKey: ['qryFilterQuestions', url]});
        filterChanged();
    };
    const onNext = async () => {
        if (isLoading) return;
        setNext(true);
        setNextTick(nextTick + 1);
        setOldQuestionNumber(question?.questionNumber);
        setTriggerFilter(true);
        await queryClient.invalidateQueries({queryKey: ['qryFilterQuestions', url]});
        //filterChanged();
        //setNext(undefined);
    };

    const onObservation = async () => {
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
            {!(question && !isLoading) || (<AnswerQuestion
                questionLoading={isLoading}
                quizAttemptId={""}
                onAnswer={onAnswer}
                onNext={onNext}
                onObservation={onObservation}
                question={question}/>)}
        </div>
    );
}