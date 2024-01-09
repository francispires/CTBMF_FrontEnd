import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";

export const AddUser = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div>
      <>
        <Button onPress={onOpen} color="primary">
          Novo Usuário
        </Button>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="top-center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Novo Usuário
                </ModalHeader>
                <ModalBody>
                  <Input label="Email" variant="bordered" />
                  <Input label="Nome" variant="bordered" />
                  <Input label="Sobreneom" variant="bordered" />
                  <Input label="Celular" variant="bordered" />

                  <Input label="Senha" type="password" variant="bordered" />
                  <Input
                    label="Confirma Senha"
                    type="password"
                    variant="bordered"
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onClick={onClose}>
                    Fechar
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Salvar
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    </div>
  );
};
