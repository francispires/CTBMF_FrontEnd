import {
    Dropdown,
    DropdownTrigger,
    Button,
    DropdownMenu,
    DropdownItem,
    DropdownSection, cn
} from "@nextui-org/react";
import {VerticalDotsIcon} from "../icons/VerticalDotsIcon.tsx";
import {CopyDocumentIcon} from "../icons/CopyDocumentIcon.tsx";
import {EditDocumentIcon} from "../icons/EditDocumentIcon.tsx";
import {DeleteDocumentIcon} from "../icons/DeleteDocumentIcon.tsx";
import {QuestionResponseDto} from "../../types_custom.ts";

export const RenderQuestionCell = (question: QuestionResponseDto, columnKey: string) => {
    const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

    const cellValue = question[columnKey as keyof QuestionResponseDto];

    switch (columnKey) {
        case "text":
            return (
                <div className="flex flex-col">
                    <p title={cellValue} className="text-bold text-small capitalize">{`${cellValue?.toString().slice(0, 20)} ...`}</p>
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
                        <DropdownMenu disabledKeys={"hide"}  variant="faded" aria-label="Dropdown menu with description">
                            <DropdownSection title="Ações" showDivider>
                                <DropdownItem
                                    key="details"
                                    shortcut="⌘D"
                                    description="Exibe os detalhes da questão"
                                    startContent={<CopyDocumentIcon className={iconClasses} />}
                                >Detalhes</DropdownItem>
                                <DropdownItem
                                    key="edit"
                                    shortcut="⌘⇧E"
                                    description="Editar a questão"
                                    startContent={<EditDocumentIcon className={iconClasses} />}
                                >Editar</DropdownItem>
                            </DropdownSection>
                            <DropdownSection title="Zona Perigosa">
                                <DropdownItem
                                    key="delete"
                                    className="text-danger"
                                    color="danger"
                                    shortcut="⌘⇧R"
                                    description="Remove a questão"
                                    startContent={<DeleteDocumentIcon className={cn(iconClasses, "text-danger")} />}
                                >Remover</DropdownItem>
                            </DropdownSection>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            );
        default:
            return (
                <div className="flex flex-col">
                    <p className="text-bold text-small capitalize">{cellValue}</p>
                </div>
            );
    }
}
