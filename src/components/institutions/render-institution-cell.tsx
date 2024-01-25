import {
    Dropdown,
    DropdownTrigger,
    Button,
    DropdownMenu,
    DropdownItem,
    DropdownSection, cn, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter
} from "@nextui-org/react";
import {VerticalDotsIcon} from "../icons/VerticalDotsIcon.tsx";
import {CopyDocumentIcon} from "../icons/CopyDocumentIcon.tsx";
import {EditDocumentIcon} from "../icons/EditDocumentIcon.tsx";
import {DeleteDocumentIcon} from "../icons/DeleteDocumentIcon.tsx";
import {InstitutionResponseDto} from "../../types_custom.ts";

export const RenderInstitutionCell = (institution: InstitutionResponseDto, columnKey: string) => {
    const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

    const cellValue = institution[columnKey as keyof InstitutionResponseDto];


    let open = true;

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
                    <Modal isOpen={open} onOpenChange={()=>{open = (false)}} isDismissable={false}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                                    <ModalBody>
                                    <p>Confirmaçao</p>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="light" onPress={onClose}>
                                            Fechar
                                        </Button>
                                        <Button color="primary" onPress={onClose}>
                                            Confirmar
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
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
                                            description="Exibe os detalhes da instituição"
                                            startContent={<CopyDocumentIcon className={iconClasses} />}
                                        >Detalhes</DropdownItem>

                                <DropdownItem
                                    key="edit"
                                    shortcut="⌘⇧E"
                                    description="Editar a instituição"
                                    startContent={<EditDocumentIcon className={iconClasses} />}
                                >Editar</DropdownItem>
                            </DropdownSection>
                            <DropdownSection title="Zona Perigosa">
                                <DropdownItem
                                    key="delete"
                                    className="text-danger"
                                    color="danger"
                                    shortcut="⌘⇧R"
                                    description="Remove a instituição"
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
