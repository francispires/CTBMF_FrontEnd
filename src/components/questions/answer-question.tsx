import {
    AlternativeResponseDto,
    AnswerRequestDto, AnswerResponseDto, IAlternativeResponseDto,
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
import {useState} from "react";
import {post} from "../../_helpers/api.ts";
import {useAuth0} from "@auth0/auth0-react";
import {AlternativeResponseWithCorrect} from "../../types";


const abcdef = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

type Props = {
    question: QuestionResponseDto
};


export const AnswerQuestion = (props:Props) => {
    const [alternatives, setAlternatives] = useState<AlternativeResponseDto[]>(props.question.alternatives);
    const { user } = useAuth0();
    const toggleCorrect = (event: React.MouseEvent<HTMLButtonElement> | boolean) => {
        if (typeof event==="boolean") return;

        const id = event.currentTarget.getAttribute("data-id");
        const index = alternatives.findIndex(x => x.id === id);
        if (index !== -1) {
            const tempArray = alternatives.slice()
                .map((a) => ({...a} ));
            const isCorrect = tempArray[index]["correct"];
            if (!isCorrect) {
                tempArray.map((a) => {
                    a.correct = false;
                });
            }
            tempArray[index]["correct"] = !isCorrect;
            setAlternatives(tempArray);
        }
    }

    const answerQuestion = async ()=> {
        const correct = alternatives.filter(x => x.correct);
        if (correct.length === 0) {
            alert("Selecione pelo menos uma alternativa correta");
        } else {
            const answer = new AlternativeResponseDto({
                questionId: props.question.id,
                user: user?.email,


            });
            const apiUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL;
            const url = `${apiUrl}/${"questions/answer"}`;
            const result = await post<AlternativeResponseWithCorrect>(url,answer);
            if (result) {
                alert("Questão respondida com sucesso");
            } else {
                alert("Erro ao responder a questão");
            }
        }
    }

    function goBack() {
        window.history.back();
    }

    return (
        <>
            <Card className="">
                <CardHeader className="flex gap-3">
                    <div className="flex flex-col ">
                        <p className="text-small text-default-500">
                            <span className={"text-primary"}>Q{props.question.questionNumber}</span> |
                            Matéria: <span className={"text-primary"}>{props.question.disciplines.join(",")}</span> |
                            Subtema: <span className={"text-primary"}>{props.question.disciplines.join(",")}</span> |
                            Instituição: <span className={"text-primary"}>{props.question.in}</span> |
                            Ano: <span className={"text-primary"}>2023</span></p>
                    </div>
                </CardHeader>
                <Divider className={""}/>
                <CardBody className="grid md:grid-cols-12 grid-cols-12 2xl:grid-cols-12 p-1 items-center pl-10 ">
                    {props.question.image &&
                        <Image src={props.question.image} alt="Question Image" width={200} height={200}/>}
                    <p className={"col-span-1"}></p>
                    <p className={"col-span-10"}>{props.question.text}</p>
                </CardBody>
                <Divider/>
                <CardBody className={"pl-10"}>
                    {alternatives.map(
                        (alternative,i) =>
                            <div key={alternative.id} onClick={toggleCorrect} data-id={alternative.id}
                                 className="grid md:grid-cols-12 grid-cols-12 2xl:grid-cols-12 p-1 items-center">
                                <span className="justify-self-end">{abcdef[i]})</span>
                                <span className={"col-span-11 rounded-small p-2 ml-2 " + (alternative.correct?"bg-green-100":"bg-gray-100")}>
                                    <Checkbox onClick={toggleCorrect} color={"success"}  className={""} isSelected={alternative.correct} data-id={alternative.id}/>
                                    {alternative.text}
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
