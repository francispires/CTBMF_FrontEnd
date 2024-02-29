import {
    Dropdown,
    DropdownTrigger,
    Button,
    DropdownMenu,
    DropdownItem,
    DropdownSection, cn, PopoverTrigger, PopoverContent, Popover, Tooltip
} from "@nextui-org/react";
import { VerticalDotsIcon } from "../../components/icons/VerticalDotsIcon.tsx";
import { CopyDocumentIcon } from "../../components/icons/CopyDocumentIcon.tsx";
import { EditDocumentIcon } from "../../components/icons/EditDocumentIcon.tsx";
import { DeleteDocumentIcon } from "../../components/icons/DeleteDocumentIcon.tsx";
import { QuestionResponseDto } from "../../types_custom.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBullseye,
    faCheck,
    faEye,
    faEyeLowVision,
    faFaceRollingEyes,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import {htmlText} from "../../_helpers/utils.ts";


export const RenderQuestionCell = (
    question: QuestionResponseDto,
    columnKey: string,
    confirmRemoval?: (id: string) => void,
    editItem?: (id: string) => void,
    viewItem?: (id: string) => void
) => {
    const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

    const cellValue = question[columnKey as keyof QuestionResponseDto];

    function handleViewItem() {
        if (viewItem) {
            viewItem(question.id)
        }
    }

    function handleEditItem() {
        if (editItem) {
            editItem(question.id)
        }
    }

    function handleDeleteItem() {
        if (confirmRemoval) {
            confirmRemoval(question.id)
        }
    }

    const getHtml = () => {
        switch (columnKey) {
            case "texa":
                return (
                    <div className="flex flex-col">
                        <p dangerouslySetInnerHTML={htmlText(`${cellValue?.toString().slice(0, 60)} ...`)} title={cellValue} className="text-bold text-small capitalize"></p>
                    </div>
                );
            case "isValid":
            case "active":
                return (
                    <div className="flex flex-col center">
                        {cellValue ?
                            <FontAwesomeIcon className={"text-success"} icon={faCheck} /> :
                            <FontAwesomeIcon className={"text-danger"} icon={faXmark} />}
                    </div>
                );
            case "pop:details":
            case "text":
                return (
                    <Tooltip
                        placement={"right-end"}
                        content={
                            <div className="px-1 py-2">
                                <div className="text-small font-bold">Questão # {question.questionNumber}</div>
                                <div className="text-tiny" dangerouslySetInnerHTML={htmlText(question.text)}></div>
                            </div>
                        }
                        classNames={{
                            content: [
                                "w-1/2",
                            ],
                        }}
                    >
                        <Button size="sm" variant="light" className="flex items-center justify-center">
                            <FontAwesomeIcon icon={faEye} />
                        </Button>
                    </Tooltip>
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
                                        description="Exibe os detalhes da questão"
                                        startContent={<CopyDocumentIcon className={iconClasses} />}
                                        onClick={handleViewItem}
                                    >
                                        Detalhes
                                    </DropdownItem>
                                    <DropdownItem
                                        key="edit"
                                        shortcut="⌘⇧E"
                                        description="Editar a questão"
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
                                        description="Remover a questão"
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
                        <p className="text-bold text-small capitalize">{cellValue}</p>
                    </div>
                );
        }
    };

    return getHtml();

}
