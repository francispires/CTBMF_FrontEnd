import React from "react";
import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
import {useInfiniteScroll} from "@nextui-org/use-infinite-scroll";
import {useSelect2List} from "../../_helpers/useSelect2List.ts";


export type Props = {
    url: string,
    allowsCustomValue?: boolean,
    defaultInputValue?:string,
    placeholder?: string,
    className?: string,
    label?: string,
    valueProp: string,
    textProp: string,
    selectionMode?: "single" | "multiple",
};

export default function Select2<T>({...props}:Props) {
    const [isOpen, setIsOpen] = React.useState(false);
    const {items, hasMore, isLoading, onLoadMore} = useSelect2List<T>(props.url,props.valueProp,props.textProp);
    const [, setValue] = React.useState("");
    const [, setSelectedKey] = React.useState<React.Key | null>(null);
    const [, scrollerRef] = useInfiniteScroll({
        hasMore,
        isEnabled: isOpen,
        shouldUseLoader: true, // We don't want to show the loader at the bottom of the list
        onLoadMore,
    });
    const onSelectionChange = (key: React.Key) => {
        setSelectedKey(key);
    };

    const onInputChange = (value: string) => {
        setValue(value)
    };

    return (
        <div className="flex w-full flex-col">
            <Autocomplete
                allowsCustomValue={props.allowsCustomValue || false}
                className="max-w"
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
                    <AutocompleteItem key={item.text || JSON.stringify(item)} className="capitalize">
                        {item.text}
                    </AutocompleteItem>
                )}
            </Autocomplete>
        </div>
);
}
