import TTable from "../table/table";
import {AddDiscipline} from "./add-discipline.tsx";
import {RenderDisciplineCell} from "./render-discipline-cell.tsx";
  
export const Disciplines = () => {

    const columns = [

        {name: 'name', uid: 'name',sortable:true},
        {name: 'description', uid: 'description',sortable:true},
        {name: 'image', uid: 'image',sortable:true},
        {name: 'parentId', uid: 'parentId',sortable:true},
        {name: 'parentName', uid: 'parentName',sortable:true},
        {name: 'childsCount', uid: 'childsCount',sortable:true},
        {name: 'Ações', uid: 'actions'},
    ] as Column[];

    const initialVisibleColumns = ["name","description","parentName", "childsCount", "actions"];

    return (
        <div className="my-5 max-w-[90rem] mx-auto w-full flex flex-col gap-10">
            <TTable<Discipline>
                rowId={"Id"}
                RenderCell={RenderDisciplineCell}
                Columns={columns}
                url={"disciplines"}
                initialVisibleColumns={initialVisibleColumns}
                addNew={<AddDiscipline />}
            >
            </TTable>
        </div>
    );
};
