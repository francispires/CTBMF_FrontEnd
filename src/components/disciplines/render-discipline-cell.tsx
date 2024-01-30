import {
    Dropdown,
    DropdownTrigger,
    Button,
    DropdownMenu,
    DropdownItem,
    DropdownSection, cn, Image, Popover, PopoverTrigger, PopoverContent
} from "@nextui-org/react";
import {VerticalDotsIcon} from "../icons/VerticalDotsIcon.tsx";
import {CopyDocumentIcon} from "../icons/CopyDocumentIcon.tsx";
import {EditDocumentIcon} from "../icons/EditDocumentIcon.tsx";
import {DeleteDocumentIcon} from "../icons/DeleteDocumentIcon.tsx";

export const RenderDisciplineCell = (discipline: Discipline, columnKey: string) => {
    const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

    //const cellValue = discipline[columnKey as keyof Discipline];

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
                        <DropdownMenu disabledKeys={"hide"}  variant="faded" aria-label="Dropdown menu with description">
                            <DropdownSection title="Ações" showDivider>
                                <Popover showArrow placement="bottom">
                                    <PopoverTrigger>
                                        <DropdownItem
                                            key="details"
                                            shortcut="⌘D"
                                            description="Exibe os detalhes da disciplina"
                                            startContent={<CopyDocumentIcon className={iconClasses} />}
                                        >Detalhes</DropdownItem>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-1">
                                        <Button>Aasd</Button>
                                    </PopoverContent>
                                </Popover>

                                <DropdownItem
                                    key="edit"
                                    shortcut="⌘⇧E"
                                    description="Editar a disciplina"
                                    startContent={<EditDocumentIcon className={iconClasses} />}
                                >Editar</DropdownItem>
                            </DropdownSection>
                            <DropdownSection title="Zona Perigosa">
                                <DropdownItem
                                    key="delete"
                                    className="text-danger"
                                    color="danger"
                                    shortcut="⌘⇧R"
                                    description="Remove a disciplina"
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
                    <p className="text-bold text-small capitalize"></p>
                </div>
            );
    }
}
