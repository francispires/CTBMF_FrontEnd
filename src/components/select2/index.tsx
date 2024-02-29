import React, {forwardRef, Key, useState} from "react";
import {Autocomplete, AutocompleteItem, cn} from "@nextui-org/react";
import {useInfiniteScroll} from "@nextui-org/use-infinite-scroll";
import {useSelect2List} from "../../_helpers/useSelect2List.ts";
import {asUploadButton} from "@rpldy/upload-button";


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
    setIsNew?: (value: boolean) => void,
    useKey?: boolean,
    groupBy?: string,
};


// export const Select2 = (
//     forwardRef(({ className, ...props }, ref) => {
//         return (Select2Inner({className,...props}));
//     }));

export default function Select2({ className="",...props }) {
    const [isOpen, setIsOpen] = useState(false);
    const {items, hasMore, isLoading, onLoadMore} = useSelect2List<string>(props.url,props.valueProp,props.textProp);
    const [, setValue] = useState("");
    const [textValue, setTextValue] = useState("");
    const [, setSelectedKey] = useState<Key | null>(null);
        
    const [, scrollerRef] = useInfiniteScroll({
        hasMore,
        isEnabled: isOpen,
        shouldUseLoader: true, // We don't want to show the loader at the bottom of the list
        onLoadMore,
    });
    const onSelectionChange = (key: Key) => {
        props.setIsNew && props.setIsNew(false);
        setSelectedKey(key);
        if (props.useKey) {
            props.setValue(key as string);
        }
    };

    const onInputChange = (value: string) => {
        const test = items.find((x) => x.text === value);
        props.setIsNew && props.setIsNew(!test);
        if (test) {
            setSelectedKey(test.value!);
        }
        setValue(value);
        if (!props.useKey){
            props.setValue(value);
        }else{
            props.setValue(test?.value || value);
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
                {
                    (item) => (
                    <AutocompleteItem key={item.value || JSON.stringify(item)} className="capitalize">
                        {item.text}
                    </AutocompleteItem>
                    )
                }
            </Autocomplete>
        </div>
);
}
