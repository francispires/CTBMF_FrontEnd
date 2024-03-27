import {Chip, cn, Select,  SelectItem} from "@nextui-org/react";
import {useSelect2List} from "../../_helpers/useSelect2List.ts";
import {useInfiniteScroll} from "@nextui-org/use-infinite-scroll";
import {useState} from "react";
import {DeleteDocumentIcon} from "../icons/DeleteDocumentIcon.tsx";
import {clean} from "../../_helpers/utils.ts";


export type Props = {
    url: string,
    allowsCustomValue?: boolean,
    defaultInputValue?:string,
    placeholder?: string,
    label?: string,
    valueProp: string,
    textProp: string,
    value?: string,
    selectionMode?: "single" | "multiple",
    setValue: (value: string) => void,
    setValues?: (value: string[]) => void,
    useKey?: boolean,
};

export default function SelectStatic<T>({ className="",...props }) {
    const [isOpen, setIsOpen] = useState(false);
    const {items, hasMore, isLoading, onLoadMore} = useSelect2List<T>(props.url,props.valueProp,props.textProp);
    const [values, setValues] = useState(new Set<string>([]));
    const [, scrollerRef] = useInfiniteScroll({
        hasMore,
        isEnabled: isOpen,
        shouldUseLoader: true,
        onLoadMore,
    });

    const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const set = new Set(e.target.value.split(","));
        if (set.size) setValues(set);
        props.setValues(Array.from(set).filter((s)=>s));
    };

    const clearItems = () => {
        setValues(new Set([]));
        props.setValues([]);
    }

    return (
        <div className="flex w-full flex-col w-1/4">
            <Select
                classNames={{
                    innerWrapper: "h-auto w-full",
                    value: "whitespace-break-spaces",
                }}
                endContent={!clean(Array.from(values)).length || <DeleteDocumentIcon onClick={clearItems} />}
                className={cn(className)}
                isMultiline={true}
                size={"lg"}
                label={props.label}
                selectionMode={props.selectionMode || "multiple"}
                placeholder={props.placeholder}
                scrollRef={scrollerRef}
                isLoading={isLoading}
                selectedKeys={values}
                onSelectionChange={(s)=>{setValues(new Set(Array.from(s).join(",")));}}
                onOpenChange={setIsOpen}
                onChange={handleSelectionChange}
                renderValue={(items) => {
                    return (
                        <div className="flex flex-wrap gap-2">
                            {items.map((item) => (
                                <Chip className={"whitespace-break-spaces p-3"} key={item.key}>{item.textValue}</Chip>
                            ))}
                        </div>
                    );
                }}
            >

                {items.map((item) => (
                    <SelectItem textValue={item.text || JSON.stringify(item)} key={item.value || JSON.stringify(item)} value={item.value}>
                        {item.text}
                    </SelectItem>
                ))}

            </Select>
        </div>
);
}
