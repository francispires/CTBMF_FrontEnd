import {QuestionResponseDto} from "../../types_custom.ts";
import {Card, CardBody, CardFooter, CardHeader, Checkbox, Divider, Textarea,Image} from "@nextui-org/react";

const abcdef = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

type Props = {
    question: QuestionResponseDto
};
export const AnswerQuestion = (props:Props) => {
    return (
        <>
            <Card className="">
                <CardHeader className="flex gap-3">
                    <div className="flex flex-col">
                        <p className="text-small text-default-500">
                            <span className={"text-primary"}>Q2468</span> |
                            Matéria: <span className={"text-primary"}>Matemática</span> |
                            Subtema: <span className={"text-primary"}>Derivadas</span> |
                            Instituição: <span className={"text-primary"}>USP</span> |
                            Ano: <span className={"text-primary"}>2023</span></p>
                    </div>
                </CardHeader>
                <Divider/>
                <CardBody>
                    {props.question.image && <Image src={props.question.image} alt="Question Image" width={200} height={200}/> }
                    <p>{props.question.text}</p>
                </CardBody>
                <Divider/>
                <CardBody>
                    {props.question.alternatives.map(
                        (alternative,i) =>
                            <div key={alternative.id} className="grid md:grid-cols-10 grid-cols-10 2xl:grid-cols-10 gap-0 p-1 justify-center">
                                <span className="justify-center center float-right">{abcdef[i]}</span>
                                <Textarea startContent={<Checkbox className={""} checked={alternative.correct}/>}
                                          className={"col-span-9"} min={1} max={1000} value={alternative.text}/>
                            </div>
                    )}
                </CardBody>
                <CardFooter>
                </CardFooter>
            </Card>

        </>
    );
};
