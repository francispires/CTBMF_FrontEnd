import React from "react";
import {Autocomplete, AutocompleteItem, cn} from "@nextui-org/react";
import {useInfiniteScroll} from "@nextui-org/use-infinite-scroll";
import {useSelect2List} from "../../_helpers/useSelect2List.ts";


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
    useKey?: boolean,
};

export default function Select2<T>({ className="",...props }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const {items, hasMore, isLoading, onLoadMore} = useSelect2List<T>(props.url,props.valueProp,props.textProp);
    const [, setValue] = React.useState("");
    const [useKeyAsValue] = React.useState(props.useKey || false);
    const [, setSelectedKey] = React.useState<React.Key | null>(null);
        
    const [, scrollerRef] = useInfiniteScroll({
        hasMore,
        isEnabled: isOpen,
        shouldUseLoader: true, // We don't want to show the loader at the bottom of the list
        onLoadMore,
    });
    const onSelectionChange = (key: React.Key) => {
        setSelectedKey(key);
        if (useKeyAsValue) {
            props.setValue(key as string);
        }
    };

    const onInputChange = (value: string) => {
        setValue(value);
        if (!useKeyAsValue){
            props.setValue(value);
        }
    };

    return (
        <div className="flex w-full flex-col">
            <Autocomplete
                className={cn(className)}
                allowsCustomValue={props.allowsCustomValue || false}
                variant="bordered"
                isLoading={isLoading}
                defaultInputValue={props.defaultInputValue}
                defaultItems={items}
                label={props.label}
                placeholder={props.placeholder}
                scrollRef={scrollerRef}
                multiple={props.selectionMode === "multiple"}
                onOpenChange={setIsOpen}
                onSelectionChange={onSelectionChange}
                onInputChange={onInputChange}
            >
                {(item) => (
                    <AutocompleteItem key={item.value || JSON.stringify(item)} className="capitalize">
                        {item.text}
                    </AutocompleteItem>
                )}
            </Autocomplete>
        </div>
);
}
