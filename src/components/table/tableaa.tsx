import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import {ReactNode} from "react";
// import { columns, users } from "./data";
// import { RenderUserCell } from "./render-user-cell.tsx";

export const TableWrapper = (columns:Column[],data:object[],renderCell:(u:object) => ReactNode) => {
  return (
    <div className=" w-full flex flex-col gap-4">
      <Table aria-label="">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              hideHeader={column.uid === "actions"}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={data}>
          {(item) => (
            <TableRow>
              {(columnKey) => (
                <TableCell>
                  {renderCell({ user: item, columnKey: columnKey })}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
