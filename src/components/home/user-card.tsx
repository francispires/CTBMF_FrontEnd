import {Avatar} from "@nextui-org/react";
import {useAuth0} from "@auth0/auth0-react";
import {IRankingAnswersResponseDto} from "../../types_custom.ts";
import _ from "lodash";

interface Props {
    myAnswers:IRankingAnswersResponseDto[]
}

export const UserCard = ({myAnswers}:Props) => {
    const {user} = useAuth0();
    const score = _.sumBy(myAnswers, 'questionScore');
    const disciplinesAnswer = _.toArray(_.groupBy(myAnswers, a => a.questionDisciplineParentId));
    const result = disciplinesAnswer
        .map((userAnswers: IRankingAnswersResponseDto[]) => {
            const corrects = userAnswers
                .filter((answer: IRankingAnswersResponseDto) => answer.correct);
            const sum = _.sumBy(corrects, 'questionScore');
            return {...userAnswers[0], questionScore: sum};
        });
    result.sort((a: IRankingAnswersResponseDto, b: IRankingAnswersResponseDto) => b.questionScore - a.questionScore);
    const best = result[0];
    const worst = result[result.length - 1];
    const total = myAnswers.length;
    return (
        <>
            <div hidden={true} className="grid grid-cols-2 gap-1">
                <div className=""><Avatar
                    isBordered
                    color="secondary"
                    src={user?.picture}/>
                </div>
                <div className=""><span className="text-success text-xl float-end">{score} pontos</span>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
                <div className="">
                    <h2 className="font-bold text-2xl tracking-wide">{user?.nickname}</h2>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-1">
                <h2 className="font-bold text-medium tracking-wide">Melhor:</h2>
                <span className="font-bold text-sm text-success tracking-wide">{best.questionDisciplineParentName ||best.questionDisciplineName}</span>
                <h2 className="font-bold text-medium tracking-wide">Pior:</h2>
                <span className="font-bold text-sm text-danger tracking-wide">{worst.questionDisciplineParentName ||worst.questionDisciplineName}</span>
                <h2 className="font-bold text-medium tracking-wide">Respostas:</h2>
                <span className="font-bold text-sm text-success tracking-wide">{total}</span>
            </div>
        </>
    );
};
