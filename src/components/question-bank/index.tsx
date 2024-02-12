import TTable from "../table/table";
import {AddQuestionBank} from "./add-question-bank.tsx";
import {RenderQuestionBankCell} from "./render-question-bank-cell.tsx";
import {QuestionBankRequestDto} from "../../types_custom.ts";
import t from "../../_helpers/Translations.ts";

export const QuestionBank = () => {
    const allColumns = Object.keys(new QuestionBankRequestDto())
        .filter((key) => typeof new QuestionBankRequestDto()[key as keyof QuestionBankRequestDto] !== 'object')
        .map((key) => {
            return {name: t[key as keyof t] || key, uid: key, sortable: true, filterable: true};
        }) as Column[];
    allColumns.push({name: 'Ações', uid: 'actions'});

    const initialVisibleColumns = allColumns.map((c) => c.uid);

    return (
        <div className="my-5 max-w-[99rem] mx-auto w-full flex flex-col gap-10">
            <TTable<QuestionBankRequestDto>
                what={"Banco de Questões"}
                rowId={"Id"}
                RenderCell={RenderQuestionBankCell}
                Columns={allColumns}
                url={"question_banks"}
                initialVisibleColumns={initialVisibleColumns}
                addNew={<AddQuestionBank />}
            >
            </TTable>
        </div>
    );
};
