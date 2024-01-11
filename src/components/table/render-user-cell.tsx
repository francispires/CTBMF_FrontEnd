import {
    Tooltip,
    Chip,
    User,
    Dropdown,
    DropdownTrigger,
    Button,
    DropdownMenu,
    DropdownItem,
    ChipProps, DropdownSection,cn
} from "@nextui-org/react";
import {ReactNode} from "react";
import { DeleteIcon } from "../icons/table/delete-icon";
import { EditIcon } from "../icons/table/edit-icon";
import { EyeIcon } from "../icons/table/eye-icon";
import {VerticalDotsIcon} from "../icons/VerticalDotsIcon.tsx";
import {AddNoteIcon} from "../icons/AddNoteIcon.tsx";
import {CopyDocumentIcon} from "../icons/CopyDocumentIcon.tsx";
import {EditDocumentIcon} from "../icons/EditDocumentIcon.tsx";
import {DeleteDocumentIcon} from "../icons/DeleteDocumentIcon.tsx";

export const RenderUserCell2 = ( user:AuthUser, columnKey:string ):ReactNode => {
  const cellValue = user[columnKey as keyof AuthUser];
  switch (columnKey) {
    case "name":
      return (
        <User
          avatarProps={{
            src: user.picture,
          }}
          name={cellValue}
        >
          {user.email}
        </User>
      );
    case "role":
      return (
        <div>
          <div>
            <span>{cellValue}</span>
          </div>
          <div>
            <span>{user.crew}</span>
          </div>
        </div>
      );
    case "status":
      return (
        <Chip
          size="sm"
          variant="flat"
          color={
            cellValue === "ativo"
              ? "success"
              : cellValue === "pausado"
              ? "danger"
              : "warning"
          }
        >
          <span className="capitalize text-xs">{cellValue}</span>
        </Chip>
      );

    case "actions":
      return (
        <div className="flex items-center gap-4 ">
          <div>
            <Tooltip content="Detalhe">
              <button onClick={() => console.log("Detalhe", user.userId)}>
                <EyeIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
          </div>
          <div>
            <Tooltip content="Editar" color="secondary">
              <button onClick={() => console.log("Editar", user.userId)}>
                <EditIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
          </div>
          <div>
            <Tooltip
              content="Remover"
              color="danger"
              onClick={() => console.log("Remover", user.userId)}
            >
              <button>
                <DeleteIcon size={20} fill="#FF0080" />
              </button>
            </Tooltip>
          </div>
        </div>
      );
    default:
      return cellValue;
  }
};

export const RenderUserCell = (user: AuthUser, columnKey: string) => {
    const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";
    const statusColorMap: Record<string, ChipProps["color"]> = {
        active: "success",
        paused: "danger",
        vacation: "warning",
    };

    const cellValue = user[columnKey as keyof AuthUser];

    switch (columnKey) {
        case "nickName":
            return (
                <User
                    avatarProps={{radius: "lg", src: user.picture}}
                    description={user.email}
                    name={cellValue}
                >
                    {user.email}
                </User>
            );
        case "crew":
            return (
                <div className="flex flex-col">
                    <p className="text-bold text-small capitalize">{cellValue}</p>
                    <p className="text-bold text-tiny capitalize text-default-400">{user.crew}</p>
                </div>
            );
        case "status":
            return (
                <Chip className="capitalize" color={statusColorMap[user.status as keyof Record<string, ChipProps["color"]>]} size="sm" variant="flat">
                    {cellValue}
                </Chip>
            );
        case "emailVerified":
            return (
                <span>
                    {cellValue && (
                        <Chip className="capitalize" color="success" size="sm" variant="flat">Ativo</Chip>
                    )}
                    {!cellValue && (
                        <Chip className="capitalize" color="danger" size="sm" variant="flat">Inativo</Chip>
                    )}
                </span>
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
                                <DropdownItem key={user.emailVerified?"hide":"show"}
                                    shortcut="⌘N"
                                    description="Aprovar o usuário"
                                    startContent={<AddNoteIcon className={iconClasses} />}
                                >Aprovar</DropdownItem>
                                <DropdownItem
                                    key="details"
                                    shortcut="⌘D"
                                    description="Exibe os detalhes do usuário"
                                    startContent={<CopyDocumentIcon className={iconClasses} />}
                                >Detalhes</DropdownItem>
                                <DropdownItem
                                    key="edit"
                                    shortcut="⌘⇧E"
                                    description="Editar o usuário"
                                    startContent={<EditDocumentIcon className={iconClasses} />}
                                >Editar</DropdownItem>
                            </DropdownSection>
                            <DropdownSection title="Zona Perigosa">
                                <DropdownItem
                                    key="delete"
                                    className="text-danger"
                                    color="danger"
                                    shortcut="⌘⇧R"
                                    description="Remove o usuário"
                                    startContent={<DeleteDocumentIcon className={cn(iconClasses, "text-danger")} />}
                                >Remover</DropdownItem>
                            </DropdownSection>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            );
        default:
            return cellValue;
    }
}
