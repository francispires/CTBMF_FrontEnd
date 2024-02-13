import {QuestionsFilter} from "../components/questions-filter";
import {AnswerQuestion} from "../components/questions/answer-question.tsx";
import { useEffect, useState} from "react";
import {get} from "../_helpers/api.ts";
import {useQuery} from "@tanstack/react-query";
import {QuestionResponseDto} from "../types_custom.ts";
import {addParams} from "../_helpers/utils.ts";

export const UserQuestions = () => {
    const [boards, setBoards] = useState([""]);
    const [institutionIds, setInstitutionIds] = useState([""]);
    const [disciplines, setDisciplines] = useState([""]);
    const [years, setYears] = useState([""]);
    const [triggerFilter, setTriggerFilter] = useState(false);

    const [questionNumber, setQuestionNumber] = useState<number|undefined>();
    const [onlyAnswereds, setOnlyAnswereds] = useState<boolean|undefined>();
    const [onlyCorrects, setOnlyCorrects] = useState<boolean|undefined>();
    const [random, setRandom] = useState<boolean|undefined>();
    const [url, setUrl] = useState("");

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL;
        const u = new URL(`${apiUrl}/questions/filter`);
        addParams(u,"boards",boards);
        addParams(u,"institutionIds",institutionIds);
        addParams(u,"disciplines",disciplines);
        addParams(u,"years",years);
        if (typeof onlyAnswereds!="undefined") u.searchParams.append("onlyanswereds", onlyAnswereds.toString());
        if (typeof onlyCorrects!="undefined") u.searchParams.append("onlycorrects", onlyCorrects.toString());
        if (typeof random!="undefined") u.searchParams.append("random", random.toString());
        if (typeof questionNumber!="undefined") u.searchParams.append("questionNumber", questionNumber?.toString());
        setUrl(u.toString());
    }, [boards, institutionIds, disciplines, years, onlyAnswereds, onlyCorrects, random, questionNumber])

    const fetchData = async () => {
        const r = await get<PagedResponse<QuestionResponseDto>>(url);
        setTriggerFilter(false);
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

    return (
        <div className="my-5 max-w-[99rem] mx-auto w-full flex flex-col gap-10">
            <QuestionsFilter
                onlyAnswereds={onlyAnswereds}
                setOnlyAnswereds={setOnlyAnswereds}
                onlyCorrects={onlyCorrects}
                setOnlyCorrects={setOnlyCorrects}
                random={random}
                setRandom={setRandom}
                boards={boards} setBoards={setBoards}
                years={years} setYears={setYears}
                disciplines={disciplines} setDisciplines={setDisciplines}
                institutionIds={institutionIds} setInstitutionIds={setInstitutionIds}
                questionNumber={questionNumber} setQuestionNumber={setQuestionNumber}
                FilterChanged={filterChanged}
            />
            {isLoading && <div>Carregando...</div>}
            {data && data.queryable.length === 0 && !isLoading && <div>Nenhum registro encontrado</div>}
            {!isLoading && data != undefined && data.queryable[0] && (<AnswerQuestion question={data.queryable[0]}/>)}
        </div>
    );
}