import React, {JSX} from "react";
import { ChevronDownIcon } from "../../icons/ChevronDownIcon.tsx";
import { capitalize } from "../utils.ts";
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

interface TableTopContentProps {
    Columns: Column[],
    filterValue: string;
    customFieldFilter: Selection,
    rowsCount: number,
    visibleColumns: Selection,
    onFilterChange: (value: string) => void;
    onPageSizeChange: (value: number) => void;
    setCustomFieldFilter: (value: Selection) => void;
    setVisibleColumns: (value: Selection) => void;
    addNew?:JSX.Element,
    pageSize: number;
}

export function TableTopContent(props: TableTopContentProps) {
    const onPageSizeChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        props.onPageSizeChange(Number(e.target.value));
    }, []);

    const onFilterChange = React.useCallback((value?: string) => {
        if (value) {
            props.onFilterChange(value);
        } else {
            props.onFilterChange("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        props.onFilterChange("");
    }, [])

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-3 items-end">
                <Input
                    isClearable
                    className="w-full sm:max-w-[44%]"
                    placeholder="Pesquise..."
                    startContent={null}
                    value={props.filterValue}
                    onClear={onClear}
                    onValueChange={onFilterChange}
                />
                <div className="flex gap-3">
                    <Dropdown>
                        <DropdownTrigger className="hidden sm:flex">
                            <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                                Colunas
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            classNames={{
                                list: "overflow-scroll max-h-[50vh]",
                            }}
                            className={""}
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
                    {props.addNew}

                </div>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-default-400 text-small">{props.rowsCount} registros</span>
                <label className="flex items-center text-default-400 text-small">
                    Linhas por página:
                    <select defaultValue={props.pageSize}
                        className="bg-transparent outline-none text-default-400 text-small"
                        onChange={onPageSizeChange}>
                        <option value="5">5</option>
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
