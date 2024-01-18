import React from "react";
import {get} from "./api.ts";
export type SelectItem = {
    id: string;
    text: string;
};

export function useSelect2List(url:string) {
    const [items, setItems] = React.useState<SelectItem[]>([]);
    const [hasMore, setHasMore] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(false);
    const [offset, setOffset] = React.useState(0);
    const limit = 10; // Number of items per page, adjust as necessary

    const loadPokemon = async (currentOffset: number) => {
        const controller = new AbortController();
        const {signal} = controller;

        try {
            setIsLoading(true);
            const apiUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL;
            const res = await get<PagedResponse<Discipline>>(`${apiUrl}/${url}?currentPage=${currentOffset+1}&pageSize=${limit}`, signal);
            setHasMore(res.rowCount > (res.pageSize*(res.currentPage+1)));
            setItems((prevItems) =>{
                const newItems = res.queryable
                    .filter((item) => !prevItems.some((prevItem) => prevItem.id === item.id))
                    .map((item) => ({id: item.id, text: item.name}));
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
        loadPokemon(offset);
    }, []);

    const onLoadMore = () => {
        const newOffset = offset + limit;

        setOffset(newOffset);
        loadPokemon(newOffset);
    };

    return {
        items,
        hasMore,
        isLoading,
        onLoadMore,
    };
}


