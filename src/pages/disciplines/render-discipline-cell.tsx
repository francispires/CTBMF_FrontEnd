import {Image} from "@nextui-org/react";
import {TableActions} from "../../components/table/table/table-actions.tsx";

export const RenderDisciplineCell = (
    discipline: Discipline,
    columnKey: string,
    confirmRemoval?: (id: string) => void,
    editItem?: (id: string) => void,
    viewItem?: (id: string) => void
) => {

    //const cellValue = discipline[columnKey as keyof Discipline];

    function handleViewItem() {
        if (viewItem) {
            viewItem(discipline.id)
        }
    }

    function handleEditItem() {
        if (editItem) {
            editItem(discipline.id)
        }
    }

    function handleDeleteItem() {
        if (confirmRemoval) {
            confirmRemoval(discipline.id)
        }
    }

    switch (columnKey) {
        case "name":
            return (
                <div className="flex flex-col">
                    <p className="text-bold text-small capitalize">{discipline.name}</p>
                </div>
            );
        case "description":
            return (
                <div className="flex flex-col">
                    <p className="text-bold text-small capitalize">{discipline.description}</p>
                </div>
            );
        case "image":
            return (
                <Image src={discipline.picture}></Image>
            );
        case "parentId":
            return (
                <div className="flex flex-col">
                    <p className="text-bold text-small capitalize">{discipline.parentId}</p>
                </div>
            );
        case "childsCount":
            return (
                <div className="flex flex-col">
                    <p className="text-bold text-small capitalize">{discipline.childsCount}</p>
                </div>
            );
        case "parentName":
            return (
                <div className="flex flex-col">
                    <p className="text-bold text-small capitalize">{discipline.parentName}</p>
                </div>
            );
        case "actions":
            return (
                <TableActions view={handleViewItem} edit={handleEditItem} remove={handleDeleteItem}></TableActions>
            );
        default:
            return (
                <div className="flex flex-col">
                    <p className="text-bold text-small capitalize"></p>
                </div>
            );
    }
}
