import React from "react";
import {Select, SelectItem} from "@nextui-org/react";
import {useInfiniteScroll} from "@nextui-org/use-infinite-scroll";
import {useSelect2List} from "../../_helpers/useSelect2List.ts";


export type Props = {
    url: string,
    placeholder?: string,
    className?: string,
    label?: string,
    selectionMode?: "single" | "multiple",
};

export default function Select2({...props}:Props) {
    const [isOpen, setIsOpen] = React.useState(false);
    const {items, hasMore, isLoading, onLoadMore} = useSelect2List(props.url);

    const [, scrollerRef] = useInfiniteScroll({
        hasMore,
        isEnabled: isOpen,
        shouldUseLoader: false, // We don't want to show the loader at the bottom of the list
        onLoadMore,
    });

    return (
        <Select
            isLoading={isLoading}
            items={items}
            scrollRef={scrollerRef}
            onOpenChange={setIsOpen}
            {...props}
        >
        {(item) => (<SelectItem key={item.id} className="capitalize">{item.text}</SelectItem>
)}
    </Select>
);
}
