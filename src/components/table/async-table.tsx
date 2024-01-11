import React, {Key, ReactNode, useEffect} from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Pagination,
    Selection,
    SortDescriptor, Spinner
} from "@nextui-org/react";
import {PlusIcon} from "../icons/PlusIcon.tsx";
import {ChevronDownIcon} from "../icons/ChevronDownIcon.tsx";
import {SearchIcon} from "../icons/SearchIcon.tsx";
import {statusOptions} from "../../old_store/datat.ts";
import {capitalize} from "./utils";
import {useAppDispatch} from "../../app/hooks.ts";


type Props<T> = {
    Columns: Column[],
    Data: T[],
    RenderCell: ( user:T, columnKey:string ) => ReactNode,
    fetchData: (pagination:PaginatedRequest<T>) => PagedResponse<T>,
    goto: (n:number) => void,
    onRowsPerPageChange: (n:number) => void,
    rowId:string,
    paging: Pagination,
    isLoading?: boolean,
    initialVisibleColumns?: string[],
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

    const dispatch = useAppDispatch()
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

    const handlePageChange = (pageNumber: number) => {
        const p = {page:pageNumber,perPage:props.paging.pageSize,sort:"",filter:{text:""}} as PaginatedRequest<T>;
        dispatch(props.fetchData(p));
    }
    useEffect(() => {
        handlePageChange(1);
    }, [paging.pageSize,paging.pageNumber,paging.totalPages]);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return props.Columns;

        return props.Columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const filteredItems = React.useMemo(() => {

        let filteredData: T[] = [];
        if (typeof props.Data!=="undefined") {
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

    const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const p = {page:props.paging.pageNumber,perPage:Number(e.target.value),sort:"",filter:{text:""}} as PaginatedRequest<T>;
        dispatch(props.fetchData(p));

    }, []);

    const onSearchChange = React.useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
            setPaging({...paging,pageNumber:1});
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(()=>{
        setFilterValue("");
        setPaging({...paging,pageNumber:1});
    },[])

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Search by name..."
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                                    Status
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Colunas"
                                closeOnSelect={false}
                                selectedKeys={customFieldFilter}
                                selectionMode="multiple"
                                onSelectionChange={setCustomFieldFilter}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem key={status.uid} className="capitalize">
                                        {capitalize(status.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                                    Colunas
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Colunas"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {props.Columns.map((column) => (
                                    <DropdownItem key={column.uid} className="capitalize">
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Button color="primary" endContent={<PlusIcon />}>
                            Add New
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">{props.paging.totalCount} registros</span>
                    <label className="flex items-center text-default-400 text-small">
                        Linhas por página:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [
        filterValue,
        customFieldFilter,
        visibleColumns,
        onSearchChange,
        onRowsPerPageChange,
        props.paging.pageSize,
        hasSearchFilter,
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
              ? "Todos selecionados"
              : `${selectedKeys.size} de ${filteredItems.length} selecionados`}
        </span>
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={props.paging.pageNumber}
                    total={props.paging.totalPages}
                    onChange={(p)=>{handlePageChange(p)}}
                />
                <div className="hidden sm:flex w-[30%] justify-end gap-2">

                </div>
            </div>
        );
    }, [selectedKeys, paging.totalCount, paging.pageNumber, paging.totalPages, hasSearchFilter]);

    return (
        <Table
            aria-label="Example table with custom cells, pagination and sorting"
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
                wrapper: "max-h-[382px]",
            }}
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
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
                       items={props.Data ?? []}
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
