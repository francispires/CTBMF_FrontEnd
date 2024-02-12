import Select2 from "../select";
import {Button, Switch} from "@nextui-org/react";

type Props = {
    FilterChanged: React.MouseEventHandler<HTMLButtonElement> | undefined;
    setBoard: (value: string) => void,
    board: string,
    setInstitutionId: (value: string) => void,
    institutionId: string,
    setDiscipline: (value: string) => void,
    discipline: string,
    setYear: (value: string) => void,
    year: string,
    setQuestionId: (value: string) => void,
    questionId: string
};


export const QuestionsFilter = (props:Props) => {

    return (
    <>
        <div className="grid md:grid-cols-4 grid-cols-1 2xl:grid-cols-4 gap-5 justify-center w-full">
            <Select2
                setValue={props.setBoard}
                value={props.board}
                defaultInputValue={props.board}
                valueProp={"text"}
                textProp={"text"}
                allowsCustomValue={true}
                url={"questions/boards"}
                selectionMode="multiple"
                label="Banca"
                placeholder="Selecione uma Banca">
            </Select2>
            <Select2
                setValue={props.setInstitutionId}
                value={props.institutionId}
                defaultInputValue={props.institutionId}
                valueProp={"value"}
                textProp={"text"}
                allowsCustomValue={true}
                url={"institutions"}
                selectionMode="multiple"
                label="Instituição"
                placeholder="Selecione uma Instituição"></Select2>
            <Select2 setValue={props.setDiscipline}
                     value={props.discipline}
                     defaultInputValue={props.discipline}
                     valueProp={"value"}
                     textProp={"text"}
                     allowsCustomValue={true}
                     url={"disciplines"}
                     selectionMode="multiple"
                     label="Disciplina"
                     placeholder="Selecione uma Disciplina"></Select2>
            <Select2 setValue={props.setYear}
                     value={props.year}
                     defaultInputValue={props.year}
                     valueProp={"value"}
                     textProp={"text"}
                     allowsCustomValue={true}
                     url={"questions/years"}
                     selectionMode="multiple"
                     label="Ano"
                     placeholder="Selecione um Ano"></Select2>
            <Select2 setValue={props.setQuestionId}
                     value={props.questionId}
                     defaultInputValue={props.questionId}
                     valueProp={"value"}
                     textProp={"text"}
                     allowsCustomValue={true}
                     url={"questions/ids"}
                     selectionMode="multiple"
                     label="Id da Questão"
                     placeholder="Id da Questão"></Select2>
            <Switch defaultSelected>Somente Respondidas</Switch>
            <Switch defaultSelected>Somente Corretas</Switch>
            <Switch defaultSelected>Aleatórias</Switch>
            <Button onClick={props.FilterChanged}>Filtrar</Button>
        </div>
    </>
    );
}