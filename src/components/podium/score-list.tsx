import { Student } from "./three-best";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  cn
} from "@nextui-org/react";
import {defaultUserPic} from "../../_helpers/utils.ts";

interface StudentsScoreListProps {
  isLarge?: boolean
  firstIndexValue?: number
  students: Student[]
}

export const StudentsScoreList = ({
  students,
  firstIndexValue = 0,
  isLarge = false
}: StudentsScoreListProps) => {
  return (
    <Table
      aria-label="Ranque dos estudantes"
      hideHeader
      classNames={{
        base: `${isLarge ? 'max-h-[310px]' : 'max-h-[210px]'} overflow-auto`,
        table: "min-h-[210px]",
      }}
    >
      <TableHeader>
        <TableColumn>NOME</TableColumn>
        <TableColumn>PONTOS</TableColumn>
      </TableHeader>
      <TableBody>
        {students.slice(firstIndexValue).map((student, index) => {
          const currentIndex = index + firstIndexValue + 1

          return (
            <TableRow
              key={index + 1}
              className={cn(
                student.position === 3 ? 'bg-gray-700 bg-opacity-20' : ''
              )}
            >
              <TableCell>
                <div className="flex gap-3 items-center pl-6">
                  <div className="flex relative">
                    <span
                      className="
                        flex text-white items-center justify-center p-1
                        rounded-full bg-primary w-8 h-8 -left-6 top-3 absolute
                      "
                    >
                      {currentIndex}
                    </span>
                    <img
                      src={defaultUserPic(student)}
                      alt="Avatar estudante"
                      className="w-14 h-14 rounded-full object-cover z-10"
                    />
                  </div>
                  <span>{student.userName}</span>
                </div>
              </TableCell>
              <TableCell>{student.questionScore} P</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
