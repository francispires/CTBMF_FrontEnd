import {Tooltip} from "@nextui-org/react";
import {EyeIcon} from "../../icons/table/eye-icon.tsx";
import {EditIcon} from "../../icons/table/edit-icon.tsx";
import {DeleteIcon} from "../../icons/table/delete-icon.tsx";


interface Props {
    view: () => void,
    edit: () => void,
    remove: () => void
}

export function TableActions({view,edit,remove}: Props) {
    return (
        <div className="flex items-center gap-4 ">
            <div>
                <Tooltip content="Detalhe">
                    <button onClick={view}>
                        <EyeIcon size={20} fill="#979797"/>
                    </button>
                </Tooltip>
            </div>
            <div>
                <Tooltip content="Editar" color="secondary">
                    <button onClick={edit}>
                        <EditIcon size={20} fill="#979797"/>
                    </button>
                </Tooltip>
            </div>
            <div>
                <Tooltip
                    content="Remover"
                    color="danger"
                >
                    <button onClick={remove}>
                        <DeleteIcon size={20} fill="#FF0080"/>
                    </button>
                </Tooltip>
            </div>
        </div>
    );
}