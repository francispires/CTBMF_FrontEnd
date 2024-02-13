import TTable from "../table/table";
import {AddInstitution} from "./add-institution.tsx";
import {RenderInstitutionCell} from "./render-institution-cell.tsx";
import {InstitutionResponseDto} from "../../types_custom.ts";
import t from "../../_helpers/Translations.ts";
import DeleteModal from "../modals/delete";
import {useCallback} from "react";

export const Institutions = () => {
     const allColumns = Object.keys(new InstitutionResponseDto())
    .filter((key) => typeof new InstitutionResponseDto()[key as keyof InstitutionResponseDto] !== 'object')
    .map((key) => {
        return {name: t[key as keyof t] || key, uid: key, sortable: true, filterable: true};
    }) as Column[];
    allColumns.push({name: 'Ações', uid: 'actions'});

    const initialVisibleColumns = allColumns.map((c) => c.uid).filter(value => value!=="id");
    //const initialVisibleColumns = Utils.GetInitialVisibleColumns(InstitutionResponseDto);/

    const confirmRemoval = useCallback((id:string)=>(
        <DeleteModal key={id} what={"Insituição"}></DeleteModal>
    ),[])

    return (
        <div className="my-5 max-w-[99rem] mx-auto w-full flex flex-col gap-10">
            <TTable<InstitutionResponseDto>
                what={"Instituições"}
                rowId={"Id"}
                RenderCell={RenderInstitutionCell}
                Columns={allColumns}
                url={"institutions"}
                initialVisibleColumns={initialVisibleColumns}
                confirmRemoval={confirmRemoval}
                addNew={<AddInstitution />}
            >
            </TTable>
        </div>
    );
};