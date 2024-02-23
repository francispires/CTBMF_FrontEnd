import { shortName } from '../../utils/string'
import { PodiumSvg } from '../icons/podium/podium'

export interface Student {
  id: string,
  name: string,
  score: number,
  image: string
}

interface ThreeBestPodiumProps {
  first: Student,
  second: Student,
  third: Student
}

export const ThreeBestPodium = ({
  first,
  second,
  third
}: ThreeBestPodiumProps) => {
  return (
    <div className="flex flex-col items-center justify-center mx-auto">
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
            {second.score}P
          </span>
          <img
            src={second.image}
            alt="Avatar estudante"
            className="w-14 h-14 rounded-full object-cover"
          />
          <span
            className='
              block text-center text-xs font-semibold
            '
          >
            {shortName(second.name)}
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
            {first.score}P
          </span>
          <img
            src={first.image}
            alt="Avatar estudante"
            className="w-14 h-14 rounded-full object-cover"
          />
          <span
            className='
              block text-center text-xs font-semibold
            '
          >
            {shortName(first.name)}
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
            {third.score}P
          </span>
          <img
            src={third.image}
            alt="Avatar estudante"
            className="w-14 h-14 rounded-full object-cover"
          />
          <span
            className='
              block text-center text-xs font-semibold
            '
          >
            {shortName(third.name)}
          </span>
        </div>
      </div>
      <PodiumSvg />
    </div>
  )
}
