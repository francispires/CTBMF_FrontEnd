import {useQuery} from "@tanstack/react-query";
import {get} from "./api.ts";
import {ConfigResponseDto} from "../types_custom.ts";
import {apiUrl} from "./utils.ts";


const fetchConfig = async () => {
    return get<PagedResponse<ConfigResponseDto>>(`${apiUrl}/configs?currentPage=1&pageSize=1000&sort=key`);
}

export class Config {
    data: ConfigResponseDto[];

    constructor(data?: ConfigResponseDto[]) {
        this.data = data || [];
    }

    get(key: string) {
        return this.data.find((c) => c.key.toLowerCase() === key.toLowerCase())?.value
    }
}

const parseConfig = (data: PagedResponse<ConfigResponseDto>) => {
    return new Config(data.queryable);
}

export const useConfig = () => useQuery({ queryKey: ['configs'], queryFn: fetchConfig,select: parseConfig });