import { shortName } from '../../utils/string'
import { PodiumSvg } from '../icons/podium/podium'

export interface Student {
  userSid?: string | undefined,
  userName?: string | undefined,
  questionScore?: number | undefined,
  userImage?: string | undefined,
  position?: number
}

export interface ThreeBestPodiumProps {
  first: Student,
  second: Student,
  third: Student,
  others?: Student[],
  all?: Student[],
  position?: number
}


export const Top3 = ({first,second,third}:ThreeBestPodiumProps) => {
  if (!first && !second && !third)
    return <div></div>
  return <div className="flex flex-col items-center justify-center mx-auto">
    <div className="flex justify-around w-full mb-6 relative p-6">
      <div
        className="
          absolute left-6 top-10 w-full max-w-[72px]
          flex flex-col items-center justify-center
        "
      >
        <span
          className='
            block text-center py-1 px-4 text-xs rounded-full bg-gray-200
            dark:text-default-200 text-default-600 font-bold absolute -top-5
            left-0 right-0 w-full
          '
        >
          {!second || second.questionScore}P
        </span>
        <img
          src={second.userImage}
          alt="Avatar estudante"
          className="w-14 h-14 rounded-full object-cover"
        />
        <span
          className='
            block text-center text-xs font-semibold
          '
        >
          {!second || shortName(typeof second.userName === "string" ? second.userName : "")}
        </span>
      </div>
      <div
        className="
          absolute -top-4 w-full max-w-[72px]
          flex flex-col items-center justify-center
        "
      >
        <span
          className='
            block text-center py-1 px-4 text-xs rounded-full bg-gray-200
            dark:text-default-200 text-default-600 font-bold absolute -top-5
            left-0 right-0 w-full
          '
        >
           {!first || first.questionScore}P
        </span>
        <img
          src={first.userImage}
          alt="Avatar estudante"
          className="w-14 h-14 rounded-full object-cover"
        />
        <span
          className='
            block text-center text-xs font-semibold
          '
        >
          {!first || shortName(typeof first.userName === "string" ? first.userName : "")}
        </span>
      </div>
      <div
        className="
          absolute right-5 top-16 w-full max-w-[72px]
          flex flex-col items-center justify-center
        "
      >
        <span
          className='
            block text-center py-1 px-4 text-xs rounded-full bg-gray-200
            dark:text-default-200 text-default-600 font-bold absolute -top-5
            left-0 right-0 w-full
          '
        >
          {!third || third.questionScore}P
        </span>
        <img
          src={third.userImage}
          alt="Avatar estudante"
          className="w-14 h-14 rounded-full object-cover"
        />
        <span
          className='
            block text-center text-xs font-semibold
          '
        >
          {!third || shortName(typeof third.userName === "string" ? third.userName : "")}
        </span>
      </div>
    </div>
    <PodiumSvg />
  </div>
}
