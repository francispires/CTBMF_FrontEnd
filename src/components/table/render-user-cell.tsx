import {
    Tooltip,
    Chip,
    User,
    Dropdown,
    DropdownTrigger,
    Button,
    DropdownMenu,
    DropdownItem,
    ChipProps, DropdownSection,cn
} from "@nextui-org/react";
import {ReactNode} from "react";
import { DeleteIcon } from "../icons/table/delete-icon";
import { EditIcon } from "../icons/table/edit-icon";
import { EyeIcon } from "../icons/table/eye-icon";
import {VerticalDotsIcon} from "../icons/VerticalDotsIcon.tsx";
import {AddNoteIcon} from "../icons/AddNoteIcon.tsx";
import {CopyDocumentIcon} from "../icons/CopyDocumentIcon.tsx";
import {EditDocumentIcon} from "../icons/EditDocumentIcon.tsx";
import {DeleteDocumentIcon} from "../icons/DeleteDocumentIcon.tsx";
import {IUserResponseDto, UserResponseDto} from "../../types_custom.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faXmark} from "@fortawesome/free-solid-svg-icons";
import {TableActions} from "./table/table-actions.tsx";

export const RenderUserCell = (user: UserResponseDto, columnKey: string,
                               confirmRemoval?: (id: string) => void,
                               editItem?: (id: string) => void,
                               viewItem?: (id: string) => void) => {
    const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";
    const statusColorMap: Record<string, ChipProps["color"]> = {
        active: "success",
        paused: "danger",
        vacation: "warning",
    };

    const cellValue = user[columnKey as keyof UserResponseDto];
    function handleViewItem() {
        if (viewItem && user.id) {
            viewItem(user.id)
        }
    }

    function handleEditItem() {
        if (editItem && user.id) {
            editItem(user.id)
        }
    }

    function handleDeleteItem() {
        if (confirmRemoval && user.id) {
            confirmRemoval(user.id)
        }
    }
    switch (columnKey) {
        case "image":
            return (
                <User
                    avatarProps={{radius: "lg", src: user.image}}
                    description={user.email}
                    name={user.name}
                >
                    {user.email}
                </User>
            );
        case "crew":
            return (
                <div className="flex flex-col">
                    <p className="text-bold text-small capitalize">{cellValue}</p>
                    <p className="text-bold text-tiny capitalize text-default-400">{user.crewId}</p>
                </div>
            );
        case "enrollmentsCount":
            return (
                <div className="flex flex-col center">
                    {cellValue ?
                        <FontAwesomeIcon className={"text-success"} icon={faCheck} /> :
                        <FontAwesomeIcon className={"text-danger"} icon={faXmark} />}
                </div>
            );
        case "emailVerified":
            return (
                <span>
                    {cellValue && (
                        <Chip className="capitalize" color="success" size="sm" variant="flat">Ativo</Chip>
                    )}
                    {!cellValue && (
                        <Chip className="capitalize" color="danger" size="sm" variant="flat">Inativo</Chip>
                    )}
                </span>
            );
        case "actions":
            return (
                <TableActions view={handleViewItem} edit={handleEditItem} remove={handleDeleteItem}></TableActions>
            );
        default:
            return <>{cellValue}</>;
    }
}
