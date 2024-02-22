import {Button, Switch} from "@nextui-org/react";
import SelectStatic from "../select";

type Props = {
    random: boolean | undefined;
    setRandom: ((isSelected: boolean) => void) | undefined;
    onlyCorrects: boolean | undefined;
    setOnlyCorrects: ((isSelected: boolean) => void) | undefined;
    onlyAnswereds: boolean | undefined;
    setOnlyAnswereds: ((isSelected: boolean) => void) | undefined;
    FilterChanged: React.MouseEventHandler<HTMLButtonElement> | undefined;
    setBoards: (value: string[]) => void,
    boards: string[],
    setInstitutionIds: (value: string[]) => void,
    institutionIds: string[],
    setDisciplines: (value: string[]) => void,
    disciplines: string[],
    setYears: (value: string[]) => void,
    years: string[],
    setQuestionNumber: (value: number) => void,
    questionNumber: number | undefined
};


export const QuestionsFilter = (props: Props) => {

    return (
        <>
            <div className="grid md:grid-cols-4 grid-cols-1 2xl:grid-cols-4 gap-5 justify-center w-full">
                <SelectStatic
                    setValues={props.setBoards}
                    valueProp={"text"}
                    textProp={"text"}
                    allowsCustomValue={false}
                    url={"questions/boards"}
                    selectionMode="multiple"
                    label="Banca"
                    placeholder="Selecione uma Banca">
                </SelectStatic>
                <SelectStatic
                    setValues={props.setInstitutionIds}
                    value={props.institutionIds}
                    defaultInputValue={props.institutionIds}
                    valueProp={"id"}
                    textProp={"name"}
                    allowsCustomValue={false}
                    url={"institutions"}
                    selectionMode="multiple"
                    label="Instituição"
                    placeholder="Selecione uma Instituição">
                </SelectStatic>
                <SelectStatic
                    setValues={props.setDisciplines}
                    value={props.disciplines}
                    defaultInputValue={props.disciplines}
                    valueProp={"id"}
                    textProp={"name"}
                    allowsCustomValue={false}
                    url={"disciplines"}
                    selectionMode="multiple"
                    label="Disciplina"
                    placeholder="Selecione uma Disciplina"></SelectStatic>
                <SelectStatic
                    setValues={props.setYears}
                    value={props.years}
                    defaultInputValue={props.years}
                    valueProp={"value"}
                    textProp={"text"}
                    allowsCustomValue={false}
                    url={"questions/years"}
                    selectionMode="multiple"
                    label="Ano"
                    placeholder="Selecione um Ano">
                </SelectStatic>
                <SelectStatic
                    setValues={props.setQuestionNumber}
                    value={props.questionNumber}
                    defaultInputValue={props.questionNumber}
                    valueProp={"value"}
                    textProp={"value"}
                    allowsCustomValue={false}
                    url={"questions/numbers"}
                    selectionMode="multiple"
                    label="Id da Questão"
                    placeholder="Id da Questão">
                </SelectStatic>
                <Switch isSelected={props.onlyAnswereds} onValueChange={props.setOnlyAnswereds}>Somente Respondidas</Switch>
                <Switch isSelected={props.onlyCorrects} onValueChange={props.setOnlyCorrects}>Somente Corretas</Switch>
                <Switch isSelected={props.random} onValueChange={props.setRandom}>Ordem Aleatória</Switch>
                <Button onClick={props.FilterChanged}>Filtrar</Button>
            </div>
        </>
    );
}