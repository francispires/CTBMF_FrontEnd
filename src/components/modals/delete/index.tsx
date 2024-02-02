import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

type Props = {
    what: string
}
export default function DeleteModal(props:Props) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
        <div className="flex flex-col gap-2">
            <Button onPress={onOpen} className="max-w-fit">Open Modal</Button>
            <Modal
                isOpen={isOpen}
                placement={"center"}
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Remover {props.what}</ModalHeader>
                            <ModalBody>
                                <p>
                                    Tem certeza que deseja remover o registro?
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="success" variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>
                                <Button color="danger" onPress={onClose}>
                                    Remover
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
