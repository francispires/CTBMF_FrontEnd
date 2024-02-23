import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from "@nextui-org/react";
import { Student } from "./three-best";

interface StudentsScoreListProps {
  firstIndexValue?: number
  students: Student[]
}

export const StudentsScoreList = ({
  students,
  firstIndexValue = 0
}: StudentsScoreListProps) => {

  return (
    <Table
      aria-label="Ranque dos estudantes"
      hideHeader
      classNames={{
        base: "max-h-[210px] overflow-auto",
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
            <TableRow key={index + 1}>
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
                      src={student.image}
                      alt="Avatar estudante"
                      className="w-14 h-14 rounded-full object-cover z-10"
                    />
                  </div>
                  <span>{student.name}</span>
                </div>
              </TableCell>
              <TableCell>{student.score} P</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
