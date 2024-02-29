import TTable from "../../components/table/table";
import {QuestionResponseDto} from "../../types_custom.ts";
import {RenderQuestionCell} from "./render-question-cell.tsx";
import t from "../../_helpers/Translations.ts";
import {useState} from "react";
import { Selection} from "@nextui-org/react";

interface Props {
    setSelectedKeys: (selected: Selection) => void;
}

export const QuestionPicker = (props: Props) => {
    let allColumns = Object.keys(new QuestionResponseDto())
        .filter((key) => typeof new QuestionResponseDto()[key as keyof QuestionResponseDto] !== 'object')
        .map((key) => {
            return { name: t[key as keyof t] || key, uid: key, sortable: true, filterable: true };
        }) as Column[];
    allColumns.push({ name: 'Ações', uid: 'actions' });
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    const [selectedQuestions, setSelectedQuestions] = useState([""]);
    const [all, setAll] = useState(false);
    allColumns = [
        { name: "Detalhes", uid: "pop:details"},
        { name: "ID", uid: "questionNumber", sortable: true, filterable: true },
        { name: "Disciplina", uid: "disciplineName", sortable: true, filterable: true },
        { name: "Instituição", uid: "institutionName", sortable: true, filterable: true }
    ]

    const initialVisibleColumns = allColumns.map((c) => c.uid);

    const showSelected = () => {
        console.log(selectedKeys)
    }

    const setSelectedKeysWrapper = (selected: Selection) => {
        setSelectedKeys(selected);
        props.setSelectedKeys(selected);
        setSelectedQuestions(Array.from(selected));
        setAll(selected==="all");
    }

    return (
        <div>
            <span>Questões selecionadas {all?"Todas": Array.from(selectedKeys).length}</span>
            <div className={"h-[300px] overflow-auto"}>
            <TTable<QuestionResponseDto>
                what={"Questões"}
                rowId={"Id"}
                RenderCell={RenderQuestionCell}
                Columns={allColumns}
                url={"questions"}
                setSelecteds={setSelectedKeysWrapper}
                initialVisibleColumns={initialVisibleColumns}
            >
            </TTable>
            </div>
        </div>
    );
};