import t from "./Translations.ts";
import {AlternativeRequestDto} from "../types_custom.ts";
import {SortDescriptor} from "@nextui-org/react";

export class Utils{
    static GetInitialVisibleColumns<T>(obj:T) {
        type StringKeys<T> = { [P in keyof T]: T[P] extends string ? P : never }[keyof T]
        type NewType = Pick<T, StringKeys<T>>; // { a: string; c: string; }

        const f = obj as NewType;
        const ks = Object.keys(f);

        console.log(ks)


        const allColumns = Object.keys(f)
            .filter((key) => obj[key as keyof T] !== 'object')
            .map((key) => {
                return {name: t[key as keyof t] || key, uid: key, sortable: true, filterable: true};
            }) as Column[];
        allColumns.push({name: 'Ações', uid: 'actions'});

        return allColumns.map((c) => c.uid).filter(value => value !== "id");
    }
}


export const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const apiUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL;

export const imageUrl = (folder:string,img:string)=>(
    `${import.meta.env.VITE_REACT_APP_BUCKET_URL}/${folder}/${img}`
);


export const urltoFile = (url:string, filename:string, mimeType:string)=>{
    if (url.startsWith('data:')) {
        var arr = url.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[arr.length - 1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        var file = new File([u8arr], filename, {type:mime || mimeType});
        return Promise.resolve(file);
    }
    return fetch(url)
        .then(res => res.arrayBuffer())
        .then(buf => new File([buf], filename,{type:mimeType}));
}

export const parseSortDescriptor = (lucene:boolean|undefined,sortDescriptor:SortDescriptor) => {
    if (lucene===true)
        return `${sortDescriptor.column}:${sortDescriptor.direction === "ascending" ? "1" : "0"}`;

    return `${sortDescriptor.column} ${sortDescriptor.direction === "ascending" ? "Asc" : "Desc"}`;
};

export const htmlText = (t:string|undefined)=>{
    return {__html: t} as string|TrustedHTML
};

export const clean = (arr: string[]) => {
    return arr.filter((x) => x);
}

export const addParams = (url: URL, name:string,params: string[]) => {
    clean(params).map((p) => {
        url.searchParams.append(name, p);
    });
}

export const toggleCorrectAlternative = (alternatives: AlternativeRequestDto[], id:string) => {
    const index = alternatives.findIndex(x => x.id === id);
    if (index === -1) {
        return alternatives;
    }
    const tempArray = alternatives.slice();
    const isCorrect = tempArray[index]["correct"];
    if (!isCorrect) {
        tempArray.map((a) => {
            a.correct = false;
        });
    }
    tempArray[index]["correct"] = !isCorrect;
    return tempArray;
}

export const toggleCorrectAlternativeReq = (alternatives: AlternativeRequestDto[], id:string) => {
    const index = alternatives.findIndex(x => x.id === id);
    if (index === -1) {
        return alternatives;
    }
    const tempArray = alternatives.slice();
    const isCorrect = tempArray[index]["correct"];
    if (!isCorrect) {
        tempArray.map((a) => {
            a.correct = false;
        });
    }
    tempArray[index]["correct"] = !isCorrect;
    return tempArray;
}