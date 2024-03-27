import {Avatar} from "@nextui-org/react";
import {useAuth0} from "@auth0/auth0-react";
import {IRankingAnswersResponseDto} from "../../types_custom.ts";
import _ from "lodash";
import {groupByDisciplines} from "../../_helpers/utils.ts";

interface Props {
    myAnswers:IRankingAnswersResponseDto[]
}

export const UserCard = ({myAnswers}:Props) => {
    const {user} = useAuth0();
    const score = _.sumBy(myAnswers, 'questionScore');
    const result = groupByDisciplines(myAnswers);
    result.sort((a, b) => b.balance - a.balance);
    const best = result.length>0? result[0]:null;
    const worst = result.length>0?result[result.length - 1]:null;
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
                {total==0 || (
                    <>
                        <h2 className="font-bold text-medium tracking-wide">Melhor:</h2>
                        <span
                            className="font-bold text-sm text-success tracking-wide">{best?.questionDisciplineParentName || best?.discipline}</span>
                        <h2 className="font-bold text-medium tracking-wide">Pior:</h2>
                        <span
                            className="font-bold text-sm text-danger tracking-wide">{worst?.questionDisciplineParentName || worst?.discipline}</span>
                        <h2 className="font-bold text-medium tracking-wide">Respostas:</h2>
                        <span className="font-bold text-sm text-success tracking-wide">{total}</span>
                    </>
                )}
                {total!=0 || (
                    <>
                        <h2 className="font-bold text-medium tracking-wide">Melhor:</h2>
                        <span
                            className="font-bold text-sm text-success tracking-wide">Você ainda não tem repostas corretas</span>
                        <h2 className="font-bold text-medium tracking-wide">Pior:</h2>
                        <span
                            className="font-bold text-sm text-danger tracking-wide">Você ainda não tem respostas erradas</span>
                        <h2 className="font-bold text-medium tracking-wide">Respostas:</h2>
                        <span className="font-bold text-sm text-success tracking-wide">{total}</span>
                    </>
                )}
            </div>
        </>
    );
};
