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

import {InstitutionResponseDto} from "../../types_custom.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faXmark} from "@fortawesome/free-solid-svg-icons";
import {remove} from "../../_helpers/api.ts";

export const RenderInstitutionCell = (institution: InstitutionResponseDto, columnKey: string) => {
    const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";
    //const queryClient = useQueryClient();
    const cellValue =
        institution[columnKey as keyof InstitutionResponseDto];


    const removeItem =async (id:string)=>{
        const apiUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL;
        await remove(`${apiUrl}/institutions`,id);
        // TODO: Invalidate query or use mutations
        //await queryClient.invalidateQueries({queryKey: ['qryKey']});
    }

    const openDeleteModal = async (id:string)=>{
        //TODO: Confirm before
        await removeItem(id);
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
                        <FontAwesomeIcon className={"text-success"} icon={faCheck}/> :
                        <FontAwesomeIcon className={"text-danger"} icon={faXmark} />}
                </div>
            );
        case "privateInstitution":
            return (
                <div className="flex flex-col center">
                    {cellValue ?
                        <FontAwesomeIcon className={"text-success"} icon={faCheck}/> :
                        <FontAwesomeIcon className={"text-danger"} icon={faXmark}/>}
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
                                onClick={()=>{openDeleteModal(institution.id)}}
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
            </div>;
        default:
            return (
                <div className="flex flex-col">
                    <p className="text-bold text-small capitalize">{cellValue.toString()}</p>
                </div>
            );
    }
}
