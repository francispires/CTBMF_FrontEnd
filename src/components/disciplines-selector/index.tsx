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
    onlySubDisciplines?: boolean
};

export default function DisciplinesSelector(props: Props) {

    const [disciplines, setDisciplines] = useState<DisciplineResponseDto[]>([]);
    const [subDisciplines, setSubDisciplines] = useState<DisciplineResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [disciplinesValues, setDisciplinesValues] = useState(new Set<string>([]));
    const [subDisciplinesValues, setSubDisciplinesValues] = useState(new Set<string>([]));

    const fetchDisciplines = async () => {
        setIsLoading(false);
        const url = `${apiUrl}/disciplines?currentPage=1&pageSize=1000&sort=name`
        const r = await get<PagedResponse<DisciplineResponseDto>>(url);
        setDisciplines(r.queryable.filter((d) => d.childsCount > 0));
        setSubDisciplines(r.queryable.filter((d) => d.childsCount > 0));
        setIsLoading(false);
        return r;
    }

    useEffect(() => {
        fetchDisciplines();
    }, []);

    const clearDisciplines = () => {
        setDisciplinesValues(new Set([]));
        props.setValues([]);
    }
    const clearSubDisciplines = () => {
        setSubDisciplinesValues(new Set([]));
        props.setValues2([""]);
    }
    const handleChangeDisciplinas = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const set = new Set(e.target.value.split(","));
        setDisciplinesValues(set);
        props.setValues(Array.from(set));
    };

    const handleChangeSubDisciplines = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const set = new Set(e.target.value.split(","));
        if (set.size) setSubDisciplinesValues(set);
        if (set.size) props.setValues2(Array.from(set));
    };

    if (isLoading) return <PageLoader></PageLoader>;

    return (
        <>
            {!props.onlySubDisciplines && (
                <Select
                    classNames={{
                        innerWrapper: "h-auto w-full",
                        value: "whitespace-break-spaces",
                    }}
                    selectedKeys={disciplinesValues}
                    onSelectionChange={(s) => {
                        setDisciplinesValues(new Set(Array.from(s).join(",")));
                    }}
                    endContent={!clean(Array.from(disciplinesValues)).length ||
                        <DeleteDocumentIcon onClick={clearDisciplines}/>}
                    label="Disciplina (Temas genéricos)"
                    placeholder="Disciplina"
                    size={"lg"}
                    selectionMode={"multiple"}
                    isMultiline={true}
                    onChange={handleChangeDisciplinas}
                    renderValue={(items) => {
                        return (
                            <div className="flex flex-wrap gap-2">
                                {items.map((item) => (
                                    <Chip className={"whitespace-break-spaces p-3"}
                                          key={item.key}>{item.textValue}</Chip>
                                ))}
                            </div>
                        );
                    }}
                >

                    {
                        disciplines.map((discipline) => (
                            <SelectItem key={`p_${discipline.id}`} textValue={discipline.name}>
                                <div className="flex gap-2 items-center">
                                    <div className="flex flex-col">
                                        <span className="text-small">{discipline.name}</span>
                                    </div>
                                </div>
                            </SelectItem>
                        ))
                    }
                </Select>
            )}
            <Select
                label="Conteúdo (Temas específicos)"
                placeholder="Conteúdo"
                classNames={{
                    innerWrapper: "h-auto w-full",
                    value: "whitespace-break-spaces",
                }}
                selectedKeys={subDisciplinesValues}
                onSelectionChange={(s) => {
                    setSubDisciplinesValues(new Set(Array.from(s).join(",")));
                }}
                endContent={!clean(Array.from(subDisciplinesValues)).length ||
                    <DeleteDocumentIcon onClick={clearSubDisciplines}/>}
                size={"lg"}
                selectionMode={"multiple"}
                isMultiline={true}
                onChange={handleChangeSubDisciplines}
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
                {subDisciplines.map((discipline) => (
                    <SelectSection key={`g_${discipline.id}`} showDivider title={discipline.name}>
                        {
                            discipline.childs.map((subDiscipline) => (
                                <SelectItem key={`${subDiscipline.id}`} textValue={subDiscipline.name}>
                                    <div className="flex gap-2 items-center">
                                        <div className="flex flex-col">
                                            <span className="text-small">{subDiscipline.name}</span>
                                        </div>
                                    </div>
                                </SelectItem>
                            ))
                        }
                    </SelectSection>
                ))}
            </Select>
        </>
    );
}
