import React from "react";
import {QuizAttemptConfigurationResponseDto} from "../../types_custom.ts";
import {Button, Card, Image, CardFooter, CardHeader, CardBody} from "@nextui-org/react";
import {getImageUrl} from "../../_helpers/utils.ts";
import {useNavigate} from "react-router-dom";

interface Props {
    children?: React.ReactNode;
    className?: string;
    config: QuizAttemptConfigurationResponseDto;
}

export const QuizConfigCard = ({children, className, config}: Props) => {
    const navigation = useNavigate();
    function gotoAnswerQuiz(attemptConfigId: string) {
        navigation(`/provas/${attemptConfigId}`)
    }

    const avgScore = config.questions?.reduce((acc, q) => acc + q.score, 0) / config.questions.length;
    const avgScoreStr = isNaN(avgScore)?0: avgScore.toFixed(2);

    return (
        <Card isFooterBlurred
              className={"w-full h-[300px] col-span-12 sm:col-span-7" + className + (!config.image ? " bg-gray-900" : "")}
        >
            <CardHeader className="absolute z-10 top-1 flex-col items-start">
                <p className="text-tiny text-white/60 uppercase font-bold">{config.name}</p>
                <h4 className="text-white/90 font-medium text-xl">{config.description}</h4>
            </CardHeader>
            {config.image && (
                <Image
                    isZoomed={true}
                    removeWrapper
                    alt={config.name}
                    className="z-0 w-full h-full object-cover"
                    src={getImageUrl("quiz-attempt-configs", config.image)}
                />
            )}
            <CardBody>
                {children}
            </CardBody>
            <CardFooter
                className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                <div className="flex flex-grow gap-2 items-center">
                    <Image
                        alt="Breathing app icon"
                        className="rounded-full w-10 h-11 bg-black"
                        src="/images/breathing-app-icon.jpeg"
                    />
                    <div className="flex flex-col">
                        <p className="text-tiny text-white/60">{config.questionsCount} questões</p>
                        <p className="text-tiny text-white/60">Dificuldade: {avgScoreStr}</p>
                    </div>
                </div>
                <Button onClick={() => gotoAnswerQuiz(config.id!)} radius="full" size="sm">Vamos lá!</Button>

            </CardFooter>
        </Card>
    );
};