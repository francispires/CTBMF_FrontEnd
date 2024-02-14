import TTable from "../table/table";
import { AddQuestion } from "./add-question.tsx";
import { RenderQuestionCell } from "./render-question-cell.tsx";
import { QuestionResponseDto } from "../../types_custom.ts";
import t from "../../_helpers/Translations.ts";
import { useNavigate } from "react-router-dom";

export const Questions = () => {
    const navigate = useNavigate()

    const allColumns = Object.keys(new QuestionResponseDto())
        .filter((key) => typeof new QuestionResponseDto()[key as keyof QuestionResponseDto] !== 'object')
        .map((key) => {
            return { name: t[key as keyof t] || key, uid: key, sortable: true, filterable: true };
        }) as Column[];
    allColumns.push({ name: 'Ações', uid: 'actions' });

    const initialVisibleColumns = allColumns.map((c) => c.uid);

    function goToQuestionDetailsPage(id: string) {
        navigate(`/view-question/${id}`)
    }

    function goToEditQuestionPage(id: string) {
        navigate(`/edit-question/${id}`)
    }

    return (
        <div className="my-5 max-w-[99rem] mx-auto w-full flex flex-col gap-10">
            <TTable<QuestionResponseDto>
                what={"Questões"}
                rowId={"Id"}
                RenderCell={RenderQuestionCell}
                Columns={allColumns}
                url={"questions"}
                initialVisibleColumns={initialVisibleColumns}
                addNew={<AddQuestion />}
                viewItem={goToQuestionDetailsPage}
                editItem={goToEditQuestionPage}
            >
            </TTable>
        </div>
    );
};
