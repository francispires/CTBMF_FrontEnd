import t from "./Translations.ts";

export class Utils{
    static GetInitialVisibleColumns<T>(obj:T) {
        type StringKeys<T> = { [P in keyof T]: T[P] extends string ? P : never }[keyof T]
        type NewType = Pick<T, StringKeys<T>>; // { a: string; c: string; }

        const f = obj as NewType;
        const ks = Object.keys(f);

        console.log(ks)


        const allColumns = Object.keys(obj)
            .filter((key) => obj[key as keyof T] !== 'object')
            .map((key) => {
                return {name: t[key as keyof t] || key, uid: key, sortable: true, filterable: true};
            }) as Column[];
        allColumns.push({name: 'Ações', uid: 'actions'});

        return allColumns.map((c) => c.uid).filter(value => value !== "id");
    }
}

export const clean = (arr: string[]) => {
    return arr.filter((x) => x);
}

export const addParams = (url: URL, name:string,params: string[]) => {
    clean(params).map((p) => {
        url.searchParams.append(name, p);
    });
}