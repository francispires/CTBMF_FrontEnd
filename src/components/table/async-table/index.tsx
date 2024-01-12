import React, { Key, ReactNode } from "react";
import { TableTopContent } from "./async-table-top.tsx";
import { TableBottomContent } from "./async-table-bottom.tsx";
// import {SearchIcon} from "../icons/SearchIcon.tsx";

import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Selection,
    SortDescriptor, Spinner
} from "@nextui-org/react";

type Props<T> = {
    Columns: Column[],
    Data: T[],
    rowId: string,
    paging: Pagination,
    isLoading?: boolean,
    initialVisibleColumns?: string[],
    RenderCell: (user: T, columnKey: string) => ReactNode,
    fetchData: (pagination: PaginatedRequest<T>) => PagedResponse<T>,
    goto: (n: number) => void,
    onRowsPerPageChange: (n: number) => void,
}

export default function AsyncTable<T>(props: Props<T>) {
    // const onNextPage = React.useCallback(() => {
    //     const pageNumber = paging.pageNumber + 1;
    //     const p = {page:pageNumber,perPage:props.paging.pageSize,sort:"",filter:{text:""}} as PaginatedRequest<T>;
    //     dispatch(props.fetchData(p));
    // }, []);
    //
    // const onPreviousPage = React.useCallback(() => {
    //     const pageNumber = paging.pageNumber - 1;
    //     const p = {page:pageNumber,perPage:props.paging.pageSize,sort:"",filter:{text:""}} as PaginatedRequest<T>;
    //     dispatch(props.fetchData(p));
    // }, []);

    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(props.initialVisibleColumns));
    const [customFieldFilter, setCustomFieldFilter] = React.useState<Selection>("all");
    const [paging, setPaging] = React.useState(props.paging);
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: "age",
        direction: "ascending",
    });

    const loadingState = props.isLoading || props.Data?.length === 0 ? "loading" : "idle";

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return props.Columns;

        return props.Columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const filteredItems = React.useMemo(() => {

        let filteredData: T[] = [];
        if (typeof props.Data !== "undefined") {
            filteredData = props.Data;
        }

        if (hasSearchFilter) {
            filteredData = filteredData.filter((d) =>
                JSON.stringify(d).toLowerCase().includes(filterValue.toLowerCase())
            );
        }
        // if (customFieldFilter !== "all" && Array.from(customFieldFilter).length !== statusOptions.length) {
        //     filteredData = filteredData.filter((user) =>
        //         Array.from(customFieldFilter).includes(user[customFieldFilter as keyof User])
        //     );
        // }

        return filteredData;
    }, [props.Data, filterValue, customFieldFilter]);

    const renderCell = React.useCallback(props.RenderCell, []);

    return (
        <Table
            aria-label="Example table with custom cells, pagination and sorting"
            isHeaderSticky
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            sortDescriptor={sortDescriptor}
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
            topContentPlacement="outside"
            bottomContentPlacement="outside"
            classNames={{
                wrapper: "max-h-[382px]",
            }}
            topContent={
                <TableTopContent
                    Columns={props.Columns}
                    filterValue={filterValue}
                    visibleColumns={visibleColumns}
                    customFieldFilter={customFieldFilter}
                    paging={paging}
                    fetchData={props.fetchData}
                    setFilterValue={setFilterValue}
                    setPaging={setPaging}
                    setVisibleColumns={setVisibleColumns}
                    setCustomFieldFilter={setCustomFieldFilter}
                />
            }
            bottomContent={
                <TableBottomContent
                    filteredItems={filteredItems}
                    fetchData={props.fetchData}
                    paging={paging}
                    selectedKeys={selectedKeys}
                />
            }
        >
            <TableHeader columns={headerColumns}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : "start"}
                        allowsSorting={column.sortable}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>

            <TableBody emptyContent={"No users found"}
                items={filterValue ? filteredItems : props.Data ?? []}
                loadingContent={<Spinner />}
                loadingState={loadingState}
            >
                {(item) => (
                    <TableRow key={item[props.rowId as keyof T] as Key}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey as string)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
