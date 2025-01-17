import {VerticalDotsIcon} from "../../components/icons/VerticalDotsIcon.tsx";
import {CopyDocumentIcon} from "../../components/icons/CopyDocumentIcon.tsx";
import {EditDocumentIcon} from "../../components/icons/EditDocumentIcon.tsx";
import {DeleteDocumentIcon} from "../../components/icons/DeleteDocumentIcon.tsx";

import {
    Dropdown,
    DropdownTrigger,
    Button,
    DropdownMenu,
    DropdownItem,
    DropdownSection, cn
} from "@nextui-org/react";
import {UserResponseDto} from "../../types_custom.ts";

export const RenderUserCell = (
    user: UserResponseDto,
    columnKey: string,
    confirmRemoval?: (id: string) => void,
    editItem?: (id: string) => void,
    viewItem?: (id: string) => void
) => {
    const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

    //const cellValue = discipline[columnKey as keyof Discipline];

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
        case "id":
            return (
                <div className="flex flex-col">
                    <p className="text-bold text-small capitalize">{user.id}</p>
                </div>
            );
        case "name":
            return (
                <div className="flex flex-col">
                    <p className="text-bold text-small capitalize">{user.name}</p>
                </div>
            );
        case "email":
            return (
                <div className="flex flex-col">
                    <p className="text-bold text-small capitalize">{user.email?.toString()}</p>
                </div>
            );
        case "crewId":
            return (
                <div className="flex flex-col">
                    <p className="text-bold text-small capitalize">{user.crewId?.toString()}</p>
                </div>
            );
        case "actions":
            return (
                <div className="relative flex justify-end items-center gap-2">
                    <Dropdown>
                    <DropdownTrigger>
                            <Button isIconOnly size="sm" variant="light">
                                <VerticalDotsIcon className="text-default-300" />
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu disabledKeys={"hide"} variant="faded" aria-label="Dropdown menu with description">
                            <DropdownSection title="Ações" showDivider>
                                <DropdownItem
                                    key="details"
                                    shortcut="⌘D"
                                    description="Exibe os detalhes da disciplina"
                                    startContent={<CopyDocumentIcon className={iconClasses} />}
                                    onClick={handleViewItem}
                                >
                                    Detalhes
                                </DropdownItem>
                                <DropdownItem
                                    key="edit"
                                    shortcut="⌘⇧E"
                                    description="Editar a disciplina"
                                    startContent={<EditDocumentIcon className={iconClasses} />}
                                    className="relative border"
                                    onClick={handleEditItem}
                                >
                                    Editar
                                </DropdownItem>
                            </DropdownSection>
                            <DropdownSection title="Zona Perigosa">
                                <DropdownItem
                                    key="delete"
                                    className="text-danger"
                                    color="danger"
                                    shortcut="⌘⇧R"
                                    description="Remover a disciplina"
                                    startContent={<DeleteDocumentIcon className={cn(iconClasses, "text-danger")} />}
                                    onClick={handleDeleteItem}
                                >
                                    Remover
                                </DropdownItem>
                            </DropdownSection>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            );
        default:
            return (
                <div className="flex flex-col">
                    <p className="text-bold text-small capitalize"></p>
                </div>
            );
    }
}
