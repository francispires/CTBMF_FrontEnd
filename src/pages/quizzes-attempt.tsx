import { useNavigate, useParams } from "react-router-dom";
import { MyCard } from "../components/layout/MyCard";
import { Button } from "@nextui-org/react";
import { FaArrowLeft } from "react-icons/fa";
import { mockedQuizzAttemptConfiguration } from "./user-question-bank";

const quizzes = [
  {
    id: '1',
    quizzAttemptType: 'Simulation',
    score: 999,
    total: 10000,
    questions: ['q1']
  },
  {
    id: '2',
    quizzAttemptType: 'Exam',
    score: 100,
    total: 13000,
    questions: ['q1', 'q2']
  },
  {
    id: '3',
    quizzAttemptType: 'Practice',
    score: 400,
    total: 9000,
    questions: ['q1', 'q2', 'q3']
  },
]

export default function QuizzesAttempt() {
  const navigate = useNavigate()
  const { attemptConfigId } = useParams()

  const attemptConfig = mockedQuizzAttemptConfiguration.find((attempt) => attempt.id === attemptConfigId)

  function goToQuestionsBank() {
    navigate(`/banco-de-questoes`)
  }

  return (
    <div className="p-6 overflow-auto min-h-[calc(100vh-65px)]">
      <Button variant="ghost" className="mb-6" onClick={goToQuestionsBank}><FaArrowLeft /> Voltar</Button>
      <h1 className="font-semibold text-xl mb-6">Quizzes - {attemptConfig?.name}</h1>

      <div
        className="
          grid items-center w-full gap-6 border-t pt-8 mt-8
          lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1
        "
      >
        {
          quizzes.map((quizz) => (
            <button
              key={quizz.id}
              className="bg-none border-none"
              onClick={() => {}}
            >
              <MyCard
                className="border-2 hover:border-primary cursor-pointer"
              >
                <strong className="block">Quizz {quizz.quizzAttemptType}</strong>
                <strong className="block">Questões: {quizz.questions.length}</strong>

                <div className="w-full border-b" />
                <div className="flex justify-between items-center gap-3 text-sm">
                  <span className="p-2 rounded-xl bg-success/20 text-success">Score: {quizz.score}</span>
                  <span className="p-2 rounded-xl bg-primary/20 text-primary">Total: {quizz.total}</span>
                </div>
              </MyCard>
            </button>
          ))
        }
      </div>
    </div>
  )
}
