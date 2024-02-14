import React, { JSX, Key, ReactNode, useCallback, useState } from "react";
import { TableTopContent } from "./table-top.tsx";
import { TableBottomContent } from "./table-bottom.tsx";

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
import { useQuery } from "@tanstack/react-query";

import { get } from "../../../_helpers/api.ts";

type Props<T> = {
    url: string,
    what: string,
    Columns: Column[],
    initialVisibleColumns?: string[],
    rowId: string,
    addNew?: JSX.Element,
    viewItem?: (id: string) => void,
    editItem?: (id: string) => void,
    confirmRemoval?: (id: string) => ReactNode
    RenderCell: (
        t: T,
        columnKey: string,
        confirmRemoval?: (id: string) => ReactNode,
        editItem?: (id: string) => void,
        viewItem?: (id: string) => void,
    ) => ReactNode
}

export default function TTable<T>(props: Props<T>) {
    const [filterValue, setFilterValue] = useState("");
    const [appliedFilter, setAppliedFilter] = useState("");
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(props.initialVisibleColumns));
    const [customFieldFilter, setCustomFieldFilter] = useState<Selection>("all");
    const [paging, setPaging] = useState({ currentPage: 1, pageSize: 10, sort: "", filter: "" } as PagedRequest);
    const [rowCount, setRowCount] = useState(0);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: props.Columns[0].uid,
        direction: "ascending"
    });

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return props.Columns;
        return props.Columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const renderCell = useCallback(props.RenderCell, []);
    const fetchData = async (pagination: PagedRequest, sort: string, filter: string) => {
        const apiUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL;
        const url = `${apiUrl}/${props.url}?currentPage=${pagination.currentPage}&pageSize=${pagination.pageSize}&sort=${sort}&filter=${filter}`;
        const response = await get<PagedResponse<T>>(url);
        setRowCount((response as PagedResponse<T>).rowCount);
        return response;
    }

    const parseSortDescriptor = () => {
        return sortDescriptor.column + " " + (sortDescriptor.direction === "ascending" ? "Asc" : "Desc");
    };

    const { isLoading, data } = useQuery({
        queryKey: ['qryKey', { ...paging, sortDescriptor, filterValue }, props.what],
        queryFn: () => fetchData(paging, parseSortDescriptor(), appliedFilter)
    });

    const changePage = (pageNumber: number) => {
        setPaging({ ...paging, currentPage: pageNumber });
    }
    const changePageSize = (pageSize: number) => {
        setPaging({ ...paging, pageSize: pageSize });
    }

    const setFilter = (filter: string) => {
        //setPaging({ ...paging, filter: filter });
        const fill = props.Columns
            .filter((column) => column.filterable)
            .map((column) => `${column.uid}:${filter}`)
            .join(" OR ");
        setAppliedFilter(fill);
        setFilterValue(filter);
    }

    const loadingState = isLoading ? "loading" : "idle";

    return (
        <Table
            className={""}
            key={"ttt"}
            onSortChange={setSortDescriptor}
            onSelectionChange={setSelectedKeys}
            selectedKeys={selectedKeys}
            sortDescriptor={sortDescriptor}
            aria-label=""
            isHeaderSticky
            selectionMode="multiple"
            topContentPlacement="outside"
            bottomContentPlacement="outside"
            classNames={{
                wrapper: "max-h-[90%]",
            }}
            topContent={
                <TableTopContent
                    Columns={props.Columns}
                    filterValue={filterValue}
                    key={"ttt"}
                    visibleColumns={visibleColumns}
                    customFieldFilter={customFieldFilter}
                    onFilterChange={setFilter}
                    setVisibleColumns={setVisibleColumns}
                    setCustomFieldFilter={setCustomFieldFilter}
                    onPageSizeChange={changePageSize}
                    rowsCount={rowCount}
                    addNew={props.addNew}
                    pageSize={paging.pageSize}
                />
            }
            bottomContent={
                <TableBottomContent
                    filteredItems={data?.queryable ?? []}
                    changePage={changePage}
                    currentPage={paging.currentPage}
                    rowCount={rowCount}
                    pageSize={paging.pageSize}
                    selectedKeys={selectedKeys}
                />
            }
        >
            <TableHeader columns={headerColumns}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : "center"}
                        allowsSorting={column.sortable}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody
                emptyContent={"Sem registros"}
                items={paging.filter ? data?.queryable : data?.queryable ?? []}
                loadingContent={<Spinner />}
                loadingState={loadingState}
            >
                {(item) => (
                    <TableRow key={props.rowId ? item[props.rowId as keyof T] as Key : JSON.stringify(item)}>
                        {(columnKey) => <TableCell align={"center"}>
                            {renderCell(item, columnKey as string, props.confirmRemoval, props.editItem, props.viewItem)}
                        </TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
