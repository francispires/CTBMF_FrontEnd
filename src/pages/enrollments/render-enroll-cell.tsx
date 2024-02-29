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
import {EnrollmentResponseDto} from "../../types_custom.ts";

export const RenderEnrollCell = (
    enroll: EnrollmentResponseDto,
    columnKey: string,
    confirmRemoval?: (id: string) => void,
    editItem?: (id: string) => void,
    viewItem?: (id: string) => void
) => {
    const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

    //const cellValue = discipline[columnKey as keyof Discipline];

    function handleViewItem() {
        if (viewItem && enroll.id) {
            viewItem(enroll.id)
        }
    }

    function handleEditItem() {
        if (editItem && enroll.id) {
            editItem(enroll.id)
        }
    }

    function handleDeleteItem() {
        if (confirmRemoval && enroll.id) {
            confirmRemoval(enroll.id)
        }
    }

    switch (columnKey) {
        case "crewName":
            return (
                <div className="flex flex-col">
                    <p className="text-bold text-small capitalize">{enroll.crewName}</p>
                </div>
            );
        case "studentName":
            return (
                <div className="flex flex-col">
                    <p className="text-bold text-small capitalize">{enroll.studentName}</p>
                </div>
            );
        case "startDate":
            return (
                <div className="flex flex-col">
                    <p className="text-bold text-small capitalize">{enroll.startDate?.toString()}</p>
                </div>
            );
        case "endDate":
            return (
                <div className="flex flex-col">
                    <p className="text-bold text-small capitalize">{enroll.endDate?.toString()}</p>
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
