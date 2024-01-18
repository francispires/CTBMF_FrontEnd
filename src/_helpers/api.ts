import {store} from "../app/store.ts";
import axios from 'axios';


axios.interceptors.request.use(function (config) {
    config.headers.Authorization = `Bearer ${authToken()}`;
    return config;
});

export async function get<T>(url:string,abortSignal?: AbortSignal) {
    try {
        const { data, status } = await axios.get<T>(
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

export async function post<T>(url:string,body: T) {
    try {
        const { data, status } = await axios.post<T>(url,body);
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
export async function uploadFile(url:string,formData: FormData,onUploadProgress:any) {
    try {
        const { data, status } = await axios.post(url,formData,onUploadProgress);
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