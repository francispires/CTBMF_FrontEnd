import TTable from "../table/table";
import {AddQuizAttemptConfiguration} from "./add-quiz-attempt-configuration.tsx";
import {RenderQuizConfigCell} from "./render-quiz_config-cell.tsx";
export const QuizAttemptConfiguration = () => {

    const columns = [
        {name: 'name', uid: 'name',sortable:true},
        {name: 'user', uid: 'user',sortable:true},
        {name: 'Questões', uid: 'questionsCount',sortable:true},
        {name: 'boards', uid: 'boards',sortable:true},
        {name: 'years', uid: 'years',sortable:true},
        {name: 'institutions', uid: 'institutions',sortable:true},
        {name: 'Ações', uid: 'actions'},
    ] as Column[];

    const initialVisibleColumns = ["name","user","questionsCount", "boards",  "years", "institutions"];

    return (
        <div className="my-5 max-w-[99rem] mx-auto w-full flex flex-col gap-10">
            <TTable<AuthUser>
                what={"Provas"}
                key={"id"}
                rowId={"id"}
                RenderCell={RenderQuizConfigCell}
                Columns={columns}
                url={"quiz_attempt_configs"}
                initialVisibleColumns={initialVisibleColumns}
                addNew={<AddQuizAttemptConfiguration />}>
            </TTable>
        </div>
    );
};
