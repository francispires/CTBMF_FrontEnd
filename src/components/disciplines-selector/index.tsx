import {Chip, Select, SelectItem, SelectSection} from "@nextui-org/react";
import {DisciplineResponseDto} from "../../types_custom.ts";
import {useEffect, useState} from "react";
import {apiUrl, clean} from "../../_helpers/utils.ts";
import {get} from "../../_helpers/api.ts";
import {PageLoader} from "../page-loader.tsx";
import {DeleteDocumentIcon} from "../icons/DeleteDocumentIcon.tsx";

type Props = {
    setValues: (value: string[]) => void,
    setValues2: (value: string[]) => void,
};

export default function DisciplinesSelector(props:Props) {

    const[disciplines,setDisciplines] = useState<DisciplineResponseDto[]>([]);
    const[subDisciplines,setSubDisciplines] = useState<DisciplineResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [values, setValues] = useState(new Set([""]));
    const [values2, setValues2] = useState(new Set([""]));
    const fetchDisciplines = async () => {
        setIsLoading(false);
        const url = `${apiUrl}/disciplines?currentPage=1&pageSize=1000&sort=name`
        const r =  await get<PagedResponse<DisciplineResponseDto>>(url);
        setDisciplines(r.queryable.filter((d) => d.childsCount > 0));
        setSubDisciplines(r.queryable.filter((d) => d.childsCount > 0));
        setIsLoading(false);
        return r;
    }

    useEffect(() => {
        fetchDisciplines();
    }, []);

    const clearItems = () => {
        setValues(new Set([]));
        props.setValues([""]);
        setDisciplines([])
    }
    const clearItems2 = () => {
        setValues2(new Set([""]));
        props.setValues2([""]);
        setSubDisciplines([])
    }
    const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const set = new Set(e.target.value.split(","));
        if (set.size) setValues(set);
        if (set.size) props.setValues(Array.from(set));
    };

    const handleSelectionChange2 = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const set = new Set(e.target.value.split(","));
        if (set.size) setValues2(set);
        if (set.size) props.setValues2(Array.from(set));
    };

    if (isLoading) return <PageLoader></PageLoader>;

    return (
        <>
        <Select
            classNames={{
                innerWrapper: "h-auto w-full",
                value: "whitespace-break-spaces",
            }}
            endContent={!clean(Array.from(values)).length || <DeleteDocumentIcon onClick={clearItems} />}
            label="Disciplina"
            placeholder="Disciplina"
            size={"lg"}
            selectionMode={"multiple"}
            isMultiline={true}
            items={disciplines}
            onChange={handleSelectionChange}
            renderValue={(items) => {
                return (
                    <div className="flex flex-wrap gap-2">
                        {items.map((item) => (
                            <Chip className={"whitespace-break-spaces p-3"} key={item.key}>{item.textValue}</Chip>
                        ))}
                    </div>
                );
            }}
        >
            {(discipline) => (
                <SelectItem key={discipline.id} textValue={discipline.name}>
                    <div className="flex gap-2 items-center">
                        <div className="flex flex-col">
                            <span className="text-small">{discipline.name}</span>
                        </div>
                    </div>
                </SelectItem>
            )}
        </Select>
            <Select
                label="Conteúdo"
                placeholder="Conteúdo"
                items={subDisciplines}
                classNames={{
                    innerWrapper: "h-auto w-full",
                    value: "whitespace-break-spaces",
                }}
                endContent={!clean(Array.from(values2)).length || <DeleteDocumentIcon onClick={clearItems2} />}
                size={"lg"}
                selectionMode={"multiple"}
                isMultiline={true}
                onChange={handleSelectionChange2}
                renderValue={(items) => {
                    return (
                        <div className="flex flex-wrap gap-2">
                            {items.map((item) => (
                                <Chip className={"whitespace-break-spaces p-3"} key={item.key}>{item.textValue}</Chip>
                            ))}
                        </div>
                    );
                }}
            >
                {(discipline) => (
                    <SelectSection showDivider title={discipline.name}>
                        {
                            discipline.childs.map((subDiscipline) => (
                            <SelectItem key={subDiscipline.id} textValue={subDiscipline.name}>
                                <div className="flex gap-2 items-center">
                                    <div className="flex flex-col">
                                        <span className="text-small">{subDiscipline.name}</span>
                                    </div>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectSection>
                )}
            </Select>
        </>
    );
}
