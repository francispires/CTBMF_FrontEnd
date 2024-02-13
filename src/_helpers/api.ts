import {store} from "../app/store.ts";
import axios from 'axios';


axios.interceptors.request.use(function (config) {
    config.headers.Authorization = `Bearer ${authToken()}`;
    return config;
});

export async function get<T>(url: string, abortSignal?: AbortSignal) {
    try {
        const {data, status} = await axios.get<T>(
            url,
            {
                signal: abortSignal,
                headers: {
                    Authorization: `Bearer ${authToken()}`,
                    Accept: '*/*'
                }
            }
        );

        console.log(JSON.stringify(data, null, 4));

        // 👇️ "response status is: 200"
        console.log('response status is: ', status);

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
            //return error.message;
            return null as T;
        } else {
            console.log('unexpected error: ', error);
            //return 'An unexpected error occurred';
            return null as T;
        }
    }
}

export async function post<T>(url: string, body: T, file?: File) {
    try {
        const config = file ? {
            headers: {
                "content-type": "multipart/form-data"
            },
        } : {};
        if (file) {url = url + '/file';}
        const {data, status} = await axios.post(url, {...body, file}, config);
        console.log(JSON.stringify(data, null, 4));
        console.log('response status is: ', status);
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
            //return error.message;
            return null as T;
        } else {
            console.log('unexpected error: ', error);
            //return 'An unexpected error occurred';
            return null as T;
        }
    }
}

export async function patch<T>(url: string, body: T, file?: File) {
    try {
        const config = file ? {
            headers: {
                "content-type": "multipart/form-data"
            },
        } : {};
        if (file) {url = url + '/file';}
        const {data, status} = await axios.patch(url, {...body, file}, config);
        console.log(JSON.stringify(data, null, 4));
        console.log('response status is: ', status);
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
            //return error.message;
            return null as T;
        } else {
            console.log('unexpected error: ', error);
            //return 'An unexpected error occurred';
            return null as T;
        }
    }
}

export async function remove(url: string, id: string) {
    try {
        const config = {};
        const {data, status} = await axios.delete(`${url}/${id}`, config);
        console.log('delete status is: ', status);
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
            return false;
        } else {
            console.log('Erro inesperado: ', error);
            return true;
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function uploadFile(url: string, formData: FormData, onUploadProgress: any) {
    try {
        const {data, status} = await axios.post(url, formData, onUploadProgress);
        console.log(JSON.stringify(data, null, 4));
        console.log('response status is: ', status);
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
            //return error.message;
            return null;
        } else {
            console.log('unexpected error: ', error);
            //return 'An unexpected error occurred';
            return null;
        }
    }
}

function authToken() {
    return store.getState().auth.user?.token;
}
