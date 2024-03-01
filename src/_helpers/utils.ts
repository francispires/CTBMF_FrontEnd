import t from "./Translations.ts";
import {AlternativeRequestDto} from "../types_custom.ts";
import {SortDescriptor} from "@nextui-org/react";
import {Student} from "../components/podium/three-best.tsx";

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

// export const urltoFile = (url:string, filename:string, mimeType:string)=>{
//     if (url.startsWith('data:')) {
//         // eslint-disable-next-line prefer-const
//         let arr = url.split(','),
//             // eslint-disable-next-line prefer-const
//             mime = arr[0] ? arr[0].match(/:(.*?);/)[1]: mimeType,
//             // eslint-disable-next-line prefer-const
//             bst = atob(arr[arr.length - 1]),
//             n = bst.length,
//             // eslint-disable-next-line prefer-const
//             u8arr = new Uint8Array(n);
//         while(n--){
//             u8arr[n] = bst.charCodeAt(n);
//         }
//         const file = new File([u8arr], filename, {type: mime || mimeType});
//         return Promise.resolve(file);
//     }
//     return fetch(url)
//         .then(res => res.arrayBuffer())
//         .then(buf => new File([buf], filename,{type:mimeType}));
// }

export const parseSortDescriptor = (lucene:boolean|undefined,sortDescriptor:SortDescriptor) => {
    if (lucene===true)
        return `${sortDescriptor.column}:${sortDescriptor.direction === "ascending" ? "1" : "0"}`;

    return `${sortDescriptor.column} ${sortDescriptor.direction === "ascending" ? "Asc" : "Desc"}`;
};

export const htmlText = (t:string)=>{
    return {__html: t} as string|TrustedHTML
};

export const clean = (arr: string[]) => {
    if(!arr) return [];
    return arr.filter((x) => x);
}


export const addParams = (url: URL, name:string,params: string[]) => {
    clean(params).map((p) => {
        url.searchParams.append(name, p);
    });
}
export const addParam = (url: URL, name:string,p: string) => {
    url.searchParams.append(name, p);
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

/**
 * @description
 * Takes an Array<V>, and a grouping function,
 * and returns a Map of the array grouped by the grouping function.
 *
 * @param list An array of type V.
 * @param keyGetter A Function that takes the the Array type V as an input, and returns a value of type K.
 *                  K is generally intended to be a property key of V.
 *
 * @returns Map of the array grouped by the grouping function.
 */
//export function groupBy<K, V>(list: Array<V>, keyGetter: (input: V) => K): Map<K, Array<V>> {
//    const map = new Map<K, Array<V>>();
// export const groupBy = (list, keyGetter)=> {
//     const map = new Map();
//     list.forEach((item) => {
//         const key = keyGetter(item);
//         const collection = map.get(key);
//         if (!collection) {
//             map.set(key, [item]);
//         } else {
//             collection.push(item);
//         }
//     });
//     return map;
// }
export const defaultUserPic = (u:Student) => {
    if (!u) return `https://www.gravatar.com/avatar/94d093eda664adde6e450d7e9881bcan?s=32&d=identicon&r=PG`;
    if (u.userImage) return u.userImage;
    const ss = u.userSid?.substring(14, 2);
    return `https://www.gravatar.com/avatar/94d093eda664adde6e450d7e9881bc${ss}?s=32&d=identicon&r=PG`;
}