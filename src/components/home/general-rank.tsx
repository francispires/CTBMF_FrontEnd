import {Tab, Tabs} from "@nextui-org/react";
import {StudentsScoreList} from "../podium/score-list";
import {ThreeBestPodiumProps, Top3} from "../podium/three-best";
import {fetchRankingData} from "../../_helpers/api.ts";
import {IRankingAnswersResponseDto} from "../../types_custom.ts";
import _ from "lodash";
import {useQuery} from "@tanstack/react-query";
import {PageLoader} from "../page-loader.tsx";
import {useAuth0} from "@auth0/auth0-react";

export const GeneralRank = () => {
  const { user } = useAuth0();
  const transformData = (data: IRankingAnswersResponseDto[]) => {
    const usersAnswers = _.toArray(_.groupBy(data, 'userName'));
    const ranking = usersAnswers.map((userAnswers:IRankingAnswersResponseDto[]) => {
      const corrects = userAnswers
          .filter((answer:IRankingAnswersResponseDto) => answer.correct);
      const sum = _.sumBy(corrects,'questionScore');
      return {...userAnswers[0], questionScore: sum};
    });
    ranking.sort((a:IRankingAnswersResponseDto, b:IRankingAnswersResponseDto) => b.questionScore - a.questionScore);
    return {
      first: ranking[0],
      second: ranking[1],
      third: ranking[2],
      others: ranking.slice(3),
      all: ranking,
      position: ranking.findIndex((r: IRankingAnswersResponseDto) => r.userSid === user?.sub)
    } as ThreeBestPodiumProps;
  }
  const { isLoading, isError, data: ranking } = useQuery({
    queryKey: ['ranking'],
    queryFn: fetchRankingData,
    select: transformData
  });


  if (isLoading || !ranking)
    return <PageLoader></PageLoader>

  if (isError)
    return <div>Ocorreu um erro ao buscar os dados.</div>

  return (
    <>
      <Tabs key="podium" variant="underlined" aria-label="Tabs podium" className="mx-auto hover:border-none">
        <Tab key="global" title="Global">
          <h1 className="mb-14 font-base">Ranking global</h1>
          <div className="flex flex-wrap items-center justify-between md:gap-8 gap-4">
            <Top3 second={ranking.second} third={ranking.third} first={ranking.first}/>
            <div className="flex-1">
              {!ranking.all ||(
                  <StudentsScoreList students={ranking.all} firstIndexValue={3} />
              )}
            </div>
          </div>
        </Tab>
        {user && (
        <Tab key="class" title="Turma">
          <h1 className="mb-2 font-base">Ranking da turma</h1>
          {ranking.position === 0 ? (
            <>
              <h2 className="font-bold text-2xl mb-3">Parabéns você está em <span className="text-4xl text-yellow-500">1º</span></h2>
              <span className="block font-base mb-10">Continue assim!</span>
            </>
          ) : (
            <>
                <h2 className="font-bold text-2xl mb-3">Você está em {(ranking.position?ranking.position:-1) + 1}º</h2>
              <span className="block font-base mb-10">Continue progredindo!</span>
            </>
          )}
          {!ranking.all || (
            <StudentsScoreList students={ranking.all} isLarge />
          )}
        </Tab>
        )}
      </Tabs>
    </>
  )
}
