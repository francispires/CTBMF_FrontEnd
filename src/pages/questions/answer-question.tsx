import {
    AlternativeRequestDto,
    AnswerRequestDto, AnswerResponseDto,
    QuestionResponseDto
} from "../../types_custom.ts";
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Checkbox,
    Divider,
    Image,
    Button, Chip, Spinner
} from "@nextui-org/react";
import React, {useEffect, useState} from "react";
import {post} from "../../_helpers/api.ts";
import {useAuth0} from "@auth0/auth0-react";
import {v4 as uuidv4} from "uuid";
import {toast} from "react-toastify";
import {abc, htmlText, imageUrl, toggleCorrectAlternative} from "../../_helpers/utils.ts";
import {AddObservation} from "./add-observation.tsx";
import ReactCardFlip from "react-card-flip";
import {PageLoader} from "../../components/page-loader.tsx";
type Props = {
    question: QuestionResponseDto,
    quizAttemptId: string | undefined,
    onAnswer: () => void,
    questionLoading: boolean
};
export const AnswerQuestion = (props: Props) => {
    const [alternatives, setAlternatives] = useState<AlternativeRequestDto[]>([]);
    const [correctAlternative, setCorrectAlternative] = useState("");
    const [selectedAlternative, setSelectedAlternative] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isFlipped, setIsFlipped] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {user} = useAuth0();
    const toggleCorrect = (event: React.MouseEvent<HTMLDivElement> | boolean) => {
        setErrorMessage("");
        if (typeof event === "boolean") return;
        const id = event.currentTarget.getAttribute("data-id");
        if (!id) return;
        setAlternatives(toggleCorrectAlternative(alternatives, id));
    }

    useEffect(() => {
        const alternatives = props.question.alternatives.map(x => new AlternativeRequestDto({...x, correct: false}));
        setAlternatives(alternatives);
    }, [props.question]);

    const answerQuestion = async () => {
        const correct = alternatives.filter(x => x.correct);
        setErrorMessage("");
        if (correct.length === 0) {
            setErrorMessage("Selecione pelo menos uma alternativa correta");
        } else {
            const answer = new AnswerRequestDto({
                questionId: props.question.id,
                correct: true,
                user: user?.email,
                alternativeId: correct[0].id,
                quizAttemptId: props.quizAttemptId,
                id: uuidv4()
            });
            setIsLoading(true);
            const apiUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL;
            const url = `${apiUrl}/${"questions/answer"}`;
            const result = (await post<AnswerRequestDto>(url, answer)) as unknown as AnswerResponseDto | null;
            setIsLoading(false);
            if (result) {
                setIsFlipped(true);
                result.correctId && setCorrectAlternative(result.correctId);
                result.alternativeId && setSelectedAlternative(result.alternativeId);
                if (result.correct) {
                    toast.success("Você acertou a questão!");
                } else {
                    toast.error("Você errou a questão!");
                }
            } else {
                toast.error("Houve um erro de servidor na resposta da questão");
            }
        }
    }

    async function nextQuestion() {
        await props.onAnswer();
        setIsFlipped(false)
    }

    const helps = props.question.observationRequests.filter(x => x.type === 0);
    const reports = props.question.observationRequests.filter(x => x.type === 1);

    // round this

    const correctPercent =Math.round(props.question.answersCorrectCount==0?0: (props.question.answersCorrectCount / props.question.answersCount) * 100);
    const chipColor = correctPercent <= 0 ? "danger" : correctPercent < 50 ? "warning" : correctPercent < 75 ? "primary" : "success";
    const chipDescription = correctPercent <= 0 ? "Muito Difícil" : correctPercent < 50 ? "Difícil" : correctPercent < 75 ? "Média" : "Fácil";


    return (
        <>
            <Card>
                <CardHeader className="">
                    <div className="grid grid-cols-12 md:grid-cols-12 lg:grid-cols-12 items-center gap-3">
                        <div className="text-small text-default-500 col-span-10">
                            <span className={"text-primary"}>Q{props.question.questionNumber}</span> |
                            Matéria: <span className={"text-primary"}>{props.question.discipline?.parentName}</span> |
                            Tema: <span className={"text-primary"}>{props.question.discipline?.name}</span> |
                            Instituição: <span className={"text-primary"}>{props.question.institutionName}</span> |
                            Ano: <span className={"text-primary mr-1"}>{props.question.year}</span>
                            <Chip
                                variant="flat"
                                color={chipColor}
                            >
                                {correctPercent}% de acerto
                            </Chip>
                            <Chip
                                variant="flat"
                                color={chipColor}
                            >
                                {chipDescription}
                            </Chip>
                        </div>
                        <div className={"col-span-2"}>
                                <AddObservation observationRequests={helps}
                                                type={0}
                                                question={props.question}>
                                </AddObservation>
                                <AddObservation observationRequests={reports}
                                                type={1}
                                                question={props.question}>
                                </AddObservation>
                        </div>
                    </div>
                </CardHeader>
                <Divider/>
                <CardBody className="grid md:grid-cols-12 grid-cols-12 2xl:grid-cols-12 p-1 items-left pl-10 flex">
                    {props.question.image &&
                        <Image className={"col-span-12"} src={imageUrl("questions",props.question.image)} alt="Question Image" width={"500px"}/>}
                    <p dangerouslySetInnerHTML={htmlText(props.question.text!)} className={"col-span-12 text-left"}></p>
                </CardBody>
                <Divider/>
                <CardBody className="pl-10">
                    {!(isLoading || props.questionLoading) ||(
                        <Spinner size="md" className="flex items-center" />
                    )}
                    <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
                        <div className={""}>
                            {alternatives.map(
                                (alternative, i) =>
                                    <div key={alternative.id} onClick={toggleCorrect} data-id={alternative.id}
                                         className="grid md:grid-cols-12 grid-cols-12 2xl:grid-cols-12 p-1 items-center">
                                        <span className="justify-self-end">{abc[i]})</span>
                                        <span
                                            className={"flex col-span-11 rounded-small p-2 ml-2 " + (alternative.correct ? "bg-green-100" : "")}>
                                    <Checkbox onClick={toggleCorrect} color={"success"} className={""}
                                              isSelected={alternative.correct} data-id={alternative.id}>
                                    <span dangerouslySetInnerHTML={htmlText(alternative.text)}></span>
                                        </Checkbox>
                                </span>

                                    </div>
                            )}
                            {errorMessage && (
                                <span className={"invalid-feedback text-danger"}>{errorMessage}</span>
                            )}
                        </div>
                        <div>
                            {alternatives.map(
                                (alternative, i) =>
                                    <div key={alternative.id}
                                         className={"grid md:grid-cols-12 grid-cols-12 2xl:grid-cols-12 p-1 items-center" +
                                         correctAlternative === alternative.id ? "" : ""
                                         }>
                                        <span className="justify-self-end">{abc[i]})</span>
                                        <span
                                            className={"flex col-span-11 rounded-small p-2 ml-2 " + (correctAlternative === alternative.id ? "bg-green-100" : "bg-danger-100")}>
                                    <Checkbox color={correctAlternative === alternative.id ? "success" : "danger"}
                                              isSelected={selectedAlternative == alternative.id}>
                                    <span dangerouslySetInnerHTML={htmlText(alternative.text)}></span>
                                        </Checkbox>
                                </span>
                                    </div>
                            )}
                        </div>
                    </ReactCardFlip>

                </CardBody>
                <CardFooter className={"flex grid-cols-2 items-center justify-center gap-3"}>
                    {isFlipped || (
                        <Button variant={"shadow"} color={"primary"} onClick={answerQuestion}
                                className={"w-1/4"}>
                            Responder
                        </Button>
                    )}
                    <Button variant={"shadow"} color={"secondary"} onClick={nextQuestion} className={"w-1/4"}>Próxima</Button>
                </CardFooter>
            </Card>
        </>
    );
};
