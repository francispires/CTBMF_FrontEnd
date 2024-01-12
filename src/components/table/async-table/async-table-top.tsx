import React from "react";
import { ChevronDownIcon } from "../../icons/ChevronDownIcon.tsx";
import { capitalize } from "../utils.ts";
import { PlusIcon } from "../../icons/PlusIcon.tsx";
import { useAppDispatch } from "../../../app/hooks.ts";
import { statusOptions } from "../../../old_store/datat.ts";

import {
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Selection,
} from "@nextui-org/react";

interface TableTopContentProps<T> {
    Columns: Column[],
    filterValue: string;
    paging: Pagination,
    customFieldFilter: Selection,
    visibleColumns: Selection,
    fetchData: (pagination: PaginatedRequest<T>) => PagedResponse<T>,
    setPaging: (value: Pagination) => void;
    setFilterValue: (value: string) => void;
    setCustomFieldFilter: (value: Selection) => void;
    setVisibleColumns: (value: Selection) => void;
}

export function TableTopContent<T>(props: TableTopContentProps<T>) {
    const dispatch = useAppDispatch()

    const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const p = { page: props.paging.pageNumber, perPage: Number(e.target.value), sort: "", filter: { text: "" } } as PaginatedRequest<T>;
        dispatch(props.fetchData(p));
    }, []);

    const onSearchChange = React.useCallback((value?: string) => {
        if (value) {
            props.setFilterValue(value);
            props.setPaging({ ...props.paging, pageNumber: 1 });
        } else {
            props.setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        props.setFilterValue("");
        props.setPaging({ ...props.paging, pageNumber: 1 });
    }, [])

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-3 items-end">
                <Input
                    isClearable
                    className="w-full sm:max-w-[44%]"
                    placeholder="Search by name..."
                    startContent={null}
                    value={props.filterValue}
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
                            selectedKeys={props.customFieldFilter}
                            selectionMode="multiple"
                            onSelectionChange={props.setCustomFieldFilter}
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
                            selectedKeys={props.visibleColumns}
                            selectionMode="multiple"
                            onSelectionChange={props.setVisibleColumns}
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
    )
}
