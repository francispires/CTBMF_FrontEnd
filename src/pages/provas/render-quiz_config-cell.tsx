import {QuizAttemptConfigurationResponseDto} from "../../types_custom.ts";
import {TableActions} from "../../components/table/table/table-actions.tsx";
import {htmlText} from "../../_helpers/utils.ts";
import {Button, Tooltip} from "@nextui-org/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons";

export const RenderQuizConfigCell = (
    config: QuizAttemptConfigurationResponseDto,
    columnKey: string,
    confirmRemoval?: (id: string) => void,
    editItem?: (id: string) => void,
    viewItem?: (id: string) => void
) => {
    function handleViewItem() {
        if (viewItem && config.id) {
            viewItem(config.id)
        }
    }

    function handleEditItem() {
        if (editItem && config.id) {
            editItem(config.id)
        }
    }

    function handleDeleteItem() {
        if (confirmRemoval && config.id) {
            confirmRemoval(config.id)
        }
    }

    switch (columnKey) {
        case "name":
            return (
                <div className="flex flex-col">
                    <p className="text-bold text-small capitalize">{config.name}</p>
                </div>
            );
        case "questionsCount":
            return (
                <div className="flex flex-col">
                    <p className="text-bold text-small capitalize">{config.questionsCount}</p>
                </div>
            );
        case "description":
            return (
                <Tooltip
                    placement={"right-end"}
                    content={
                        <div className="px-1 py-2">
                            <div className="text-tiny" dangerouslySetInnerHTML={htmlText(config.description??"")}></div>
                        </div>
                    }
                >
                    <Button size="sm" variant="light" className="flex items-center justify-center">
                        <FontAwesomeIcon icon={faEye}/>
                    </Button>
                </Tooltip>
            );
        case "institution":
            return (
                <div className="flex flex-col">
                    <p className="text-bold text-small capitalize">{config.institution?.name}</p>
                </div>
            );
        case "actions":
            return (
                <TableActions view={handleViewItem} edit={handleEditItem} remove={handleDeleteItem}></TableActions>
            );
        default:
            return (
                <div className="flex flex-col">
                    <p className="text-bold text-small capitalize"></p>
                </div>
            );
    }
}
