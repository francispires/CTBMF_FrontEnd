import {Button, Tooltip} from "@nextui-org/react";
import {QuestionResponseDto} from "../../types_custom.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCheck,
    faEye,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import {htmlText} from "../../_helpers/utils.ts";
import {TableActions} from "../../components/table/table/table-actions.tsx";


export const RenderQuestionCell = (
    question: QuestionResponseDto,
    columnKey: string,
    confirmRemoval?: (id: string) => void,
    editItem?: (id: string) => void,
    viewItem?: (id: string) => void
) => {

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
                        <p dangerouslySetInnerHTML={htmlText(`${cellValue?.toString().slice(0, 60)} ...`)}
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
                                <div className="text-small font-bold">Questão # {question.questionNumber}</div>
                                <div className="text-tiny" dangerouslySetInnerHTML={htmlText(question.text??"")}></div>
                            </div>
                        }
                        classNames={{
                            content: [
                                "w-1/2",
                            ],
                        }}
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
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">{cellValue}</p>
                    </div>
                );
        }
    };

    return getHtml();

}
