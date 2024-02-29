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
    DropdownSection, cn, Image
} from "@nextui-org/react";

export const RenderCrewCell = (
    discipline: Discipline,
    columnKey: string,
    confirmRemoval?: (id: string) => void,
    editItem?: (id: string) => void,
    viewItem?: (id: string) => void
) => {
    const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

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
