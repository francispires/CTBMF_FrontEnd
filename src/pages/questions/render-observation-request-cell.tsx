import {Button, Tooltip} from "@nextui-org/react";
import {
    ObservationRequestResponseDto,
    ObservationResponseDto,
    ObservationType,
    QuestionResponseDto
} from "../../types_custom.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCheck, faCircleXmark,
    faEye, faHandsHelping, faWarning,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import {htmlText} from "../../_helpers/utils.ts";
import {TableActions} from "../../components/table/table/table-actions.tsx";


export const RenderObservationRequestCell = (
    observation: ObservationRequestResponseDto,
    columnKey: string,
    confirmRemoval?: (id: string) => void,
    editItem?: (id: string) => void,
    viewItem?: (id: string) => void
) => {

    const cellValue = observation[columnKey as keyof ObservationRequestResponseDto];

    function handleViewItem() {
        if (viewItem) {
            viewItem(observation.id)
        }
    }

    function handleEditItem() {
        if (editItem) {
            editItem(observation.id)
        }
    }

    function handleDeleteItem() {
        if (confirmRemoval) {
            confirmRemoval(observation.id)
        }
    }

    const getHtml = () => {
        switch (columnKey) {
            case "user":
                return (
                    <div className="text-center">
                        <div className="flex flex-col">{observation.user?.name}</div>
                    </div>
                )
            case "observationRequest":
            case "type":
                return (
                    <div className="text-center">
                        {observation.type===0 ?
                            <FontAwesomeIcon className={"text-success"} icon={faHandsHelping}/> :
                            <FontAwesomeIcon className={"text-danger"} icon={faWarning}/>}
                    </div>
                )
            case "observationsCount":
                return (
                    <div className="text-center">
                        <div className="flex flex-col">{observation.observationsCount}</div>
                    </div>
                )
            case "resolved":
                return (
                    <div className="text-center">
                        {observation.resolved?
                            <FontAwesomeIcon className={"text-success"} icon={faCheck}/> :
                            <FontAwesomeIcon className={"text-danger"} icon={faCircleXmark}/>}
                    </div>
                )

            case "question":
                return (
                    <Tooltip
                        placement={"right-end"}
                        content={
                            <div className="px-1 py-2">
                                <div className="text-small font-bold">Questão
                                    # {observation.question?.questionNumber}</div>
                                <div className="text-tiny"
                                     dangerouslySetInnerHTML={htmlText(observation.question?.text ?? "")}></div>
                            </div>
                        }>
                        <Button size="sm" variant="light" className="flex items-center justify-center">
                            <FontAwesomeIcon icon={faEye}/>
                        </Button>
                    </Tooltip>
                );
            case "texa":
                return (
                    <div className="flex flex-col">
                        <p dangerouslySetInnerHTML={htmlText(`${observation.question?.text?.toString().slice(0, 60)} ...`)}
                           title={cellValue} className="text-bold text-small capitalize"></p>
                    </div>
                );
            case "isValid":
            case "active":
                return (
                    <div className="flex flex-col center">
                        {cellValue ?
                            <FontAwesomeIcon className={"text-success"} icon={faCheck}/> :
                            <FontAwesomeIcon className={"text-danger"} icon={faXmark}/>}
                    </div>
                );
            case "pop:details":
            case "text":
                return (
                    <Tooltip
                        placement={"right-end"}
                        content={
                            <div className="px-1 py-2">
                                <div className="text-small font-bold">Aluno : {observation.user?.name}</div>
                                <div className="text-tiny"
                                     dangerouslySetInnerHTML={htmlText(observation.text ?? "")}></div>
                            </div>
                        }

                    >
                        <Button size="sm" variant="light" className="flex items-center justify-center">
                            <FontAwesomeIcon icon={faEye}/>
                        </Button>
                    </Tooltip>
                );
            case "actions":
                return (
                    <TableActions view={handleViewItem} edit={handleEditItem} remove={handleDeleteItem}/>
                );
            default:
                return (
                    <div className="flex flex-col"></div>
                );
        }
    };

    return getHtml();

}
