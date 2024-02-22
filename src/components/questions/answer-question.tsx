import {
    AlternativeRequestDto,
    AnswerRequestDto,
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
    Button
} from "@nextui-org/react";
import React, {useEffect, useState} from "react";
import {post} from "../../_helpers/api.ts";
import {useAuth0} from "@auth0/auth0-react";
import {v4 as uuidv4} from "uuid";
import {toast} from "react-toastify";
import {abc, htmlText, toggleCorrectAlternative} from "../../_helpers/utils.ts";
import {AddObservation} from "./add-observation.tsx";



type Props = {
    question: QuestionResponseDto,
    quizAttemptId: string|undefined
};


export const AnswerQuestion = (props:Props) => {
    const [alternatives, setAlternatives] = useState<AlternativeRequestDto[]>([]);
    const { user } = useAuth0();
    const toggleCorrect = (event: React.MouseEvent<HTMLDivElement> | boolean) => {
        if (typeof event==="boolean") return;
        const id = event.currentTarget.getAttribute("data-id");
        if (!id) return;
        setAlternatives(toggleCorrectAlternative(alternatives,id));
    }
    
    useEffect(() => {
        const alternatives = props.question.alternatives.map(x => new AlternativeRequestDto({...x,correct:false}));
        setAlternatives(alternatives);
    }, [props.question]);

    const answerQuestion = async ()=> {
        const correct = alternatives.filter(x => x.correct);
        if (correct.length === 0) {
            alert("Selecione pelo menos uma alternativa correta");
        } else {
            const answer = new AnswerRequestDto({
                questionId: props.question.id,
                correct: true,
                user:user?.email,
                alternativeId: correct[0].id,
                quizAttemptId: props.quizAttemptId,
                id: uuidv4()
            });
            const apiUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL;
            const url = `${apiUrl}/${"questions/answer"}`;
            const result = await post<AnswerRequestDto>(url,answer);
            if (result) {
                toast.success("Questão respondida.");
            } else {
                toast.error("Erro ao responder a questão.")
            }
        }
    }

    function goBack() {
        window.history.back();
    }



    const helps = props.question.observationRequests.filter(x => x.type === 0);
    const reports = props.question.observationRequests.filter(x => x.type === 1);



    return (
        <>
            <Card className="">
                <CardHeader className="">
                    <div className="grid grid-cols-12 md:grid-cols-12 gap-3 lg:grid-cols-12 w-full">
                        <div className="text-small text-default-500 col-span-10">
                            <span className={"text-primary"}>Q{props.question.questionNumber}</span> |
                            Matéria: <span className={"text-primary"}>{props.question.discipline?.name}</span> |
                            Instituição: <span className={"text-primary"}>{props.question.institutionName}</span> |
                            Ano: <span className={"text-primary"}>2023</span>
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
                <Divider className={""}/>
                <CardBody className="grid md:grid-cols-12 grid-cols-12 2xl:grid-cols-12 p-1 items-center pl-10 ">
                    {props.question.image &&
                        <Image src={props.question.image} alt="Question Image" width={200} height={200}/>}
                    <p className={"col-span-1"}></p>
                    <p dangerouslySetInnerHTML={htmlText(props.question.text!)} className={"col-span-10"}></p>
                </CardBody>
                <Divider/>
                <CardBody className={"pl-10"}>
                    {alternatives.map(
                        (alternative,i) =>
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
                </CardBody>
                <CardFooter className={"flex justify-end gap-12 grid grid-cols-12"}>
                    <div className={"col-span-1"}></div>
                    <Button color={"primary"} onClick={answerQuestion} className={"w-1/4"}>Responder</Button>
                    <Button color={"secondary"} onClick={goBack} className={"w-1/4"}>Voltar</Button>
                </CardFooter>
            </Card>
        </>
    );
};
