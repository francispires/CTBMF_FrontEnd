import {Button,Switch} from "@nextui-org/react";
import SelectStatic from "../../components/select";
import DisciplinesSelector from "../../components/disciplines-selector";

type Props = {
    random: boolean | undefined;
    setRandom: ((isSelected: boolean) => void) | undefined;
    onlyCorrects: boolean | undefined;
    setOnlyCorrects: ((isSelected: boolean) => void) | undefined;
    onlyAnswereds: boolean | undefined;
    setOnlyAnswereds: ((isSelected: boolean) => void) | undefined;
    onlyNotAnswereds: boolean | undefined;
    onlyWrongs: boolean | undefined;
    setOnlyNotAnswereds: ((isSelected: boolean) => void) | undefined;
    setOnlyWrongs: ((isSelected: boolean) => void) | undefined;
    FilterChanged: React.MouseEventHandler<HTMLButtonElement> | undefined;
    setBoards: (value: string[]) => void,
    boards: string[],
    setInstitutionIds: (value: string[]) => void,
    institutionIds: string[],
    setDisciplines: (value: string[]) => void,
    setSubDisciplines: (value: string[]) => void,
    disciplines: string[],
    subDisciplines: string[],
    setYears: (value: string[]) => void,
    years: string[],
    setQuestionNumber: (value: number) => void,
    questionNumber: number | undefined,

};


export const QuestionsFilter = (props: Props) => {
    const classNames = {
        wrapper: "md:w-1/4",
    }
    return (
        <>
            <div className="grid md:grid-cols-3 grid-cols-1 2xl:grid-cols-3 gap-5 justify-center w-full">
                <DisciplinesSelector
                setValues={props.setDisciplines}
                setValues2={props.setSubDisciplines}>
                </DisciplinesSelector>
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
            </div>
            <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-6 gap-5 justify-center w-full">
                <Switch isSelected={props.onlyAnswereds} onValueChange={props.setOnlyAnswereds}>
                    Somente Respondidas
                </Switch>
                <Switch isSelected={props.onlyNotAnswereds} onValueChange={props.setOnlyNotAnswereds}>
                    Somente Não Respondidas
                </Switch>
                <Switch isSelected={props.onlyCorrects} onValueChange={props.setOnlyCorrects}>
                    Somente Corretas
                </Switch>
                <Switch isSelected={props.onlyWrongs} onValueChange={props.setOnlyWrongs}>
                    Somente Erradas
                </Switch>
                <Switch isSelected={props.random} onValueChange={props.setRandom}>
                    Ordem Aleatória
                </Switch>
                <Button className={""} color={"danger"} variant={"shadow"} size={"md"} onClick={props.FilterChanged}>Filtrar</Button>
            </div>
        </>
    );
}