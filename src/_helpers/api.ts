import {store} from "../app/store.ts";
import axios from 'axios';
import {apiUrl} from "./utils.ts";

axios.interceptors.request.use(function (config) {
    if (authToken())
        config.headers.Authorization = `Bearer ${authToken()}`;
    return config;
});

export async function get<T>(url: string, abortSignal?: AbortSignal) {
    try {
        const config = {
            signal: abortSignal,
            headers: {
                Accept: '*/*',
                Authorization: ''
            }
        };
        if (authToken())
            config.headers.Authorization = `Bearer ${authToken()}`;
        const {data, status} = await axios.get<T>(url, config);
        if (status>=400) {
            console.log(JSON.stringify(data, null, 4));
            console.log('response status is: ', status);
        }
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
        //if (file) {url = url + '/file';}
        const {data, status} = await axios.post(url, {...body, file}, config);
        if (status>=400) {
            console.log(JSON.stringify(data, null, 4));
            console.log('response status is: ', status);
        }
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
        if (file) {
            url = url + '/file';
        }
        const {data, status} = await axios.patch(url, {...body, file}, config);
        if (status>=400) {
            console.log(JSON.stringify(data, null, 4));
            console.log('response status is: ', status);
        }

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

export async function remove<T>(url: string, id: string) {
    try {
        const config = {};
        const {data, status} = await axios.delete(`${url}/${id}`, config);
        console.log('delete status is: ', status);
        return data as T;
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

export async function uploadFile(folderName: string, fileName: string, formData: FormData) {
    try {
        const url = `${apiUrl}/questions/upload64/?folderName=${folderName}&fileName=${fileName}`;
        const {data, status} = await axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log(JSON.stringify(data, null, 4));
        console.log('response status is: ', status);
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
            return null;
        } else {
            console.log('unexpected error: ', error);
            return null;
        }
    }
}

function authToken() {
    return store.getState().auth.user?.token;
}
