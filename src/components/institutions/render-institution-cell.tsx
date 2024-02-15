import {
    Dropdown,
    DropdownTrigger,
    Button,
    DropdownMenu,
    DropdownItem,
    DropdownSection, cn
} from "@nextui-org/react";
import { VerticalDotsIcon } from "../icons/VerticalDotsIcon.tsx";
import { CopyDocumentIcon } from "../icons/CopyDocumentIcon.tsx";
import { EditDocumentIcon } from "../icons/EditDocumentIcon.tsx";
import { DeleteDocumentIcon } from "../icons/DeleteDocumentIcon.tsx";

import { InstitutionResponseDto } from "../../types_custom.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

export const RenderInstitutionCell = (
    institution: InstitutionResponseDto,
    columnKey: string,
    confirmRemoval?: (id: string) => void,
    editItem?: (id: string) => void,
    viewItem?: (id: string) => void
) => {
    const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";
    //const queryClient = useQueryClient();
    const cellValue =
        institution[columnKey as keyof InstitutionResponseDto];

    function handleViewItem() {
        if (viewItem) {
            viewItem(institution.id)
        }
    }

    function handleEditItem() {
        if (editItem) {
            editItem(institution.id)
        }
    }

    function handleDeleteItem() {
        if (confirmRemoval) {
            confirmRemoval(institution.id)
        }
    }

    switch (columnKey) {
        case "text":
            return (
                <div className="flex flex-col">
                    <p title={cellValue.toString()} className="text-bold text-small capitalize">{`${cellValue?.toString().slice(0, 20)} ...`}</p>
                </div>
            );
        case "stadual":
            return (
                <div className="flex flex-col center">
                    {cellValue ?
                        <FontAwesomeIcon className={"text-success"} icon={faCheck} /> :
                        <FontAwesomeIcon className={"text-danger"} icon={faXmark} />}
                </div>
            );
        case "privateInstitution":
            return (
                <div className="flex flex-col center">
                    {cellValue ?
                        <FontAwesomeIcon className={"text-success"} icon={faCheck} /> :
                        <FontAwesomeIcon className={"text-danger"} icon={faXmark} />}
                </div>
            );
        case "actions":
            return <div className="relative flex justify-end items-center gap-2">
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
                                description="Exibe os detalhes da instituição"
                                startContent={<CopyDocumentIcon className={iconClasses} />}
                                onClick={handleViewItem}
                            >
                                Detalhes
                            </DropdownItem>
                            <DropdownItem
                                key="edit"
                                shortcut="⌘⇧E"
                                description="Editar a instituição"
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
                                description="Remover a instituição"
                                startContent={<DeleteDocumentIcon className={cn(iconClasses, "text-danger")} />}
                                onClick={handleDeleteItem}
                            >
                                Remover
                            </DropdownItem>
                        </DropdownSection>
                    </DropdownMenu>
                </Dropdown>
            </div>;
        default:
            return (
                <div className="flex flex-col">
                    <p className="text-bold text-small capitalize">{cellValue.toString()}</p>
                </div>
            );
    }
}
