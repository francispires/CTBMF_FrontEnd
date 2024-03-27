import {MyProps} from "./question-right.tsx";
import {Card, Button, CardBody, Link} from "@nextui-org/react";
import {groupByDisciplines} from "../../_helpers/utils.ts";

export const Worst = ({myAnswers}: MyProps) => {

    const groupDiscipline = groupByDisciplines(myAnswers);
    groupDiscipline.sort((a, b) => a.balance - b.balance);

    const worst = groupDiscipline.length>0?groupDiscipline[0]:null;
    const corrects = worst?.corrects??0;
    const wrongs = worst?.wrongs??0;
    const total = corrects + wrongs;
    const percentage = ((corrects / total) * 100).toFixed(2);

    return (
        <>
            <Card
                isFooterBlurred
                radius="lg"
                className="border-none bg-gradient-to-bl from-warning-100 to-warning-500"
            >
                <CardBody>
                    {total==0 || (
                    <div className={"gap-3 grid grid-cols-1 text-center [&_div]:h-px"}>
                        <h1 className={"text-lg font-bold"}>Atenção</h1>
                        <span>Você teve um baixo desempenho na seguinte matéria e deverá reforçar o seu estudo teórico e prático na mesma:</span>
                        <h1 className={"text-lg font-bold"}>{worst?.discipline??"Sem Disciplina"}</h1>
                        <Button color={"danger"} className={"font-bold"}>{percentage}% de taxa de acerto</Button>
                    </div>
                    )}
                    {total!=0 || (
                        <div className={"gap-3 grid grid-cols-1 text-center [&_div]:h-px"}>
                            <h1 className={"text-lg font-bold"}>Atenção</h1>
                            <span>Não temos respostas suficientes para as diciplinas que precisam de atenção:</span>
                            <Button color={"primary"} className={"font-bold"}>
                                <Link color={"foreground"} href={"questoes"}>Responder algumas questões</Link>
                            </Button>
                        </div>
                    )}
                </CardBody>
            </Card>
        </>
    )
}