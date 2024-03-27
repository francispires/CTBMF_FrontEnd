import TTable from "../../components/table/table";
import {QuestionResponseDto} from "../../types_custom.ts";
import {RenderQuestionCell} from "./render-question-cell.tsx";
import t from "../../_helpers/Translations.ts";
import {useEffect, useState} from "react";
import { Selection} from "@nextui-org/react";

interface Props {
    setSelectedKeys: (selected: Selection) => void;
    selectedKeys?: Set<string>;
}

export const QuestionPicker = (props: Props) => {
    let allColumns = Object.keys(new QuestionResponseDto())
        .filter((key) => typeof new QuestionResponseDto()[key as keyof QuestionResponseDto] !== 'object')
        .map((key) => {
            return { name: t[key as keyof t] || key, uid: key, sortable: true, filterable: true };
        }) as Column[];
    allColumns.push({ name: 'Ações', uid: 'actions' });
    const [selectedKeys, setSelectedKeys] = useState(props.selectedKeys ||new Set([]));
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [all, setAll] = useState(false);
    allColumns = [
        { name: "Detalhes", uid: "pop:details"},
        { name: "ID", uid: "questionNumber", sortable: true, filterable: true },
        { name: "Disciplina", uid: "disciplineName", sortable: true, filterable: true },
        { name: "Instituição", uid: "institutionName", sortable: true, filterable: true }
    ]

    const initialVisibleColumns = allColumns.map((c) => c.uid);


    const setSelectedKeysWrapper = (selected: Selection) => {
        const seld = Array.from(selected);
        setSelectedKeys(new Set(seld));
        props.setSelectedKeys(selected);
        setSelectedQuestions(Array.from(selectedKeys));
        setAll(selected==="all");
    }

    useEffect(() => {
        setSelectedKeys(new Set(props.selectedKeys));
    }, [props.selectedKeys])

    return (
        <div>
            <span>Questões selecionadas {all?"Todas": Array.from(selectedKeys).length}</span>
            <div className={"h-[50vh] overflow-auto"}>
            <TTable<QuestionResponseDto>
                what={"Questões"}
                rowId={"Id"}
                RenderCell={RenderQuestionCell}
                Columns={allColumns}
                url={"questions"}
                selectedKeys={selectedKeys}
                setSelecteds={setSelectedKeysWrapper}
                initialVisibleColumns={initialVisibleColumns}
            >
            </TTable>
            </div>
        </div>
    );
};