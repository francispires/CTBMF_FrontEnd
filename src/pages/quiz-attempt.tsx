import {useParams} from "react-router-dom";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import {
    AnswerResponseDto,
    IRankingAnswersResponseDto,
    QuestionResponseDto,
    QuizAttemptResponseDto
} from "../types_custom.ts";
import {AnswerQuestion} from "./questions/answer-question.tsx";
import {addParam, apiUrl, getImageUrl} from "../_helpers/utils.ts";
import {get} from "../_helpers/api.ts";
import {PageLoader} from "../components/page-loader.tsx";
import {CircularProgress, Image} from "@nextui-org/react";
import {QuestionRight} from "../components/charts/question-right.tsx";
import {MyCard} from "../components/layout/MyCard.tsx";
import {format} from "date-fns";

function QuizResult(props: { quizAttempt: QuizAttemptResponseDto }) {

    const [attempt, setAttempt] = useState<QuizAttemptResponseDto>({} as QuizAttemptResponseDto);
    const [answers, setAnswers] = useState<IRankingAnswersResponseDto[]>([] as IRankingAnswersResponseDto[]);
    const fetchAttempt = async () => {
        return await get<QuizAttemptResponseDto>(`${apiUrl}/quiz_attempts/${props.quizAttempt.quizAttemptConfiguration?.id}`);
    }
    useEffect(() => {
        fetchAttempt().then((r) => {
            if (!r) return;
            setAttempt(r);
            const aa =
                r.answers.map(function (a){
                    return {
                        createdAt:new Date(),
                        id: a.id,
                        isCorrect: a.isCorrect,
                        correct: a.correct,
                        questionScore: 2,
                        userSid: a.user.sid,
                    }as IRankingAnswersResponseDto
                });
            setAnswers(aa);
        });
    },[]);

    if (!attempt){
        return <PageLoader></PageLoader>
    }
    return (
        <div className="">
            <div>
                <p className="text-center text-tiny text-white/60 uppercase font-bold">Você concluíu o {attempt.quizAttemptConfiguration?.name}
                    {attempt.finishedAt ? " em "+  format(attempt.finishedAt, "dd/MM/yyyy - HH:mm") : ""}
                    </p>
            </div>
            <div>
                {!attempt.quizAttemptConfiguration?.image || (
                    <Image
                        src={getImageUrl("quiz-attempt-configs", attempt.quizAttemptConfiguration.image)}
                        className="w-full h-96 object-cover" />
                )}
                <MyCard>
                    <QuestionRight myAnswers={answers}/>
                </MyCard>
                <div className="flex flex-col items-center w-full h-full">
                    <div className="flex flex-col items-center gap-4">
                        <span className="text-white">{attempt.score} pontos</span>
                        {/*<span className="text-white">Erros: {attempt.questions.length-attempt.score}</span>*/}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function QuizAttempt() {
    const {attemptConfigId} = useParams()
    const queryClient = useQueryClient();
    const [url, setUrl] = useState("");
    const [attemptId, setAttemptId] = useState<string>("");
    const [attempt, setAttempt] = useState<QuizAttemptResponseDto>({} as QuizAttemptResponseDto);
    const [triggerFilter, setTriggerFilter] = useState(false);
    const [next, setNext] = useState<boolean | undefined>();
    const [nextTick, setNextTick] = useState<number>(0);
    const [question, setQuestion] = useState<QuestionResponseDto>();
    const [oldQuestionNumber, setOldQuestionNumber] = useState<number| undefined>();
    const [questionNumber, setQuestionNumber] = useState<number | undefined>();
    const [progress, setProgress] = useState<number>(0);

    const fetchAttempt = async () => {
        const response = await get<QuizAttemptResponseDto>(`${apiUrl}/quiz_attempts/${attemptConfigId}`);
        if (response.id) {
            setAttemptId(response.id);
            setAttempt(response);
        } else {
            setAttemptId("");
        }
        setProgress(Number.parseFloat((response.answers.length / response.questions.length * 100).toFixed(2)));
        return response;
    }
    useEffect(() => {
        fetchAttempt();
    },[]);

    useEffect(() => {
        const u = new URL(`${apiUrl}/questions/filter`);
        addParam(u, "attemptId", attemptId);
        addParam(u, "qty", attemptId);
        addParam(u, "attemptConfigId", attemptConfigId!);

        if (typeof next != "undefined" && next) {
            u.searchParams.append("next", next.toString());
            if (next && question?.questionNumber)u.searchParams.append("oldQuestionNumber", question?.questionNumber?.toString() as string);
        }
        if (typeof questionNumber != "undefined") u.searchParams.append("questionNumber", questionNumber?.toString());
        setUrl(u.toString());
        filterChanged();
    }, [nextTick,attemptId])

    const fetchData = async () => {
        if (!attemptId) return null;
        const r = await get<PagedResponse<QuestionResponseDto>>(url);
        setQuestion(r.queryable[0]);
        return r;
    }

    const {isLoading, data} = useQuery({
        queryKey: ['qryFilterQuestionsAttempt', url],
        queryFn: () => fetchData(),
        enabled: !!triggerFilter
    });

    const filterChanged = () => {
        setTriggerFilter(true);
    }
    const onAnswer = async (answer:AnswerResponseDto|null) => {
        await queryClient.invalidateQueries({queryKey: ['qryFilterQuestionsAttempt']});
        setUrl(url);
        filterChanged();
        await fetchAttempt();
    };

    const onObservation = async () => {
        await queryClient.invalidateQueries({queryKey: ['qryFilterQuestionsAttempt', url]});
        setUrl(url);
        filterChanged();
    };

    const onNext = async () => {
        if (isLoading) return;
        setNext(true);
        setNextTick(nextTick + 1);
        setOldQuestionNumber(question?.questionNumber);
        setTriggerFilter(true);
        await queryClient.invalidateQueries({queryKey: ['qryFilterQuestionsAttempt', url]});
    };


    return (
        <div className="p-6 overflow-auto min-h-[calc(100vh-65px)]">
            <div className={"grid grid-cols-10"}>
                <h1 className={"col-span-9 content__title text-center text-4xl pb-10"}>{attempt.quizAttemptConfiguration?.name}</h1>
                <CircularProgress
                    aria-label="Progresso"
                    size="lg"
                    value={progress}
                    color="success"
                    showValueLabel={true}
                />
            </div>

            {/*<Progress*/}
            {/*    aria-label="Progresso"*/}
            {/*    size="md"*/}
            {/*    value={progress}*/}
            {/*    color="success"*/}
            {/*    showValueLabel={true}*/}
            {/*    className="max-w mb-10"*/}
            {/*/>*/}
            {!isLoading || (
                <PageLoader></PageLoader>
            )}
            {!(!isLoading && data != undefined && data.queryable.length) || (
                <AnswerQuestion onNext={onNext}
                                questionLoading={isLoading}
                                onObservation={onObservation}
                                quizAttemptId={attemptId}
                                onAnswer={onAnswer}
                                question={data.queryable[0]}/>
            )}
            {!isLoading && data != undefined && !data.queryable.length && (
                <div className="flex items-center justify-center w-full p-10">
                    <QuizResult quizAttempt={attempt}/>
                </div>
            )}
        </div>
    )
}
