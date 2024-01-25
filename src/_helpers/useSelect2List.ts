import React from "react";
import {get} from "./api.ts";
export type SelectItem = {
    text?: string;
    value?:string;
};

export function useSelect2List<T>(url:string,valueProp:string,textProp:string) {
    const [items, setItems] = React.useState<SelectItem[]>([]);
    const [hasMore, setHasMore] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(false);
    const [offset, setOffset] = React.useState(0);
    const limit = 10; // Number of items per page, adjust as necessary

    const loadItems = async (currentOffset: number) => {
        const controller = new AbortController();
        const {signal} = controller;

        try {
            setIsLoading(true);
            const apiUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL;
            const res = await get<PagedResponse<T>>(`${apiUrl}/${url}?currentPage=${currentOffset+1}&pageSize=${limit}`, signal);
            setHasMore(res.rowCount > (res.pageSize*(res.currentPage+1)));
            setItems((prevItems) =>{
                const newItems = res.queryable
                    .filter((item) => !prevItems.some((prevItem) => prevItem.value === item[valueProp as keyof T]))
                    .map((item) => ({value: item[valueProp as keyof T], text: item[textProp as keyof T]} as SelectItem));
                return [...newItems, ...prevItems];
            }
            //       [...prevItems, ...res.queryable.map((item) => ({id: item.id, text: item.name}))]
            );
        } catch (error) {
                console.error("There was an error with the fetch operation:", error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        loadItems(offset);
    }, []);

    const onLoadMore = () => {
        const newOffset = offset + limit;

        setOffset(newOffset);
        loadItems(newOffset);
    };

    return {
        items,
        hasMore,
        isLoading,
        onLoadMore,
    };
}


