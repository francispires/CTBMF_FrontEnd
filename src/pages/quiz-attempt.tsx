import { useNavigate, useParams } from "react-router-dom";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import axios from "axios";
import {AnswerResponseDto, QuestionResponseDto, QuizAttemptResponseDto} from "../types_custom.ts";
import {AnswerQuestion} from "./questions/answer-question.tsx";
import {addParam,apiUrl} from "../_helpers/utils.ts";
import {get} from "../_helpers/api.ts";

export default function QuizAttempt() {
  const navigate = useNavigate();
  const { attemptConfigId } = useParams()
  const queryClient = useQueryClient();
  const [url, setUrl] = useState("");
  const [attemptId,setAttemptId] = useState<string>("");
  const [attempt,setAttempt] = useState<QuizAttemptResponseDto>({} as QuizAttemptResponseDto);
  const [triggerFilter, setTriggerFilter] = useState(false);

  const fetchAttempt = async () => {
    const attempt = await axios.get<QuizAttemptResponseDto>(`${apiUrl}/quiz_attempts/${attemptConfigId}`);

    if (attempt.status === 200) {
      setAttemptId(attempt.data.id);
      setAttempt(attempt.data);
    }else{
      setAttemptId("");
    }
    return attempt;
  }
  useEffect(() => {
    fetchAttempt();
  }, [attemptConfigId]);

  useEffect(() => {
    const u = new URL(`${apiUrl}/questions/filter`);
    addParam(u, "attemptId", attemptId);
    addParam(u, "qty", attemptId);
    addParam(u, "attemptConfigId", attemptConfigId!);
    setUrl(u.toString());
    filterChanged();
  }, [attemptId, attemptConfigId])

  const fetchData = async () => {
    const r = await get<PagedResponse<QuestionResponseDto>>(url);
    return r;
  }

  const { isLoading, data } = useQuery({
    queryKey: ['qryFilterQuestionsAttempt', url],
    queryFn: () => fetchData(),
    enabled: !!triggerFilter
  });

  const filterChanged = () => {
    setTriggerFilter(true);
  }
  const onAnswer = async (answer: AnswerResponseDto) => {
    await queryClient.invalidateQueries({queryKey: ['qryFilterQuestionsAttempt', url]});
    setUrl(url);
    filterChanged();
    console.log(answer);
  };


  return (
    <div className="p-6 overflow-auto min-h-[calc(100vh-65px)]">
      {!isLoading && data != undefined && data.queryable[0] && (<AnswerQuestion
          quizAttemptId={attemptId}
          onAnswer={onAnswer}
          question={data.queryable[0]} />)}
    </div>
  )
}
