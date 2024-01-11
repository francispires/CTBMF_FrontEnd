import {store} from "../app/store.ts";
import axios from 'axios';


axios.interceptors.request.use(function (config) {
    config.headers.Authorization = `Bearer ${authToken()}`;
    return config;
});

export async function get<T>(url:string) {
    try {
        const { data, status } = await axios.get<T>(
            url,
            {
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
            return error.message;
        } else {
            console.log('unexpected error: ', error);
            return 'An unexpected error occurred';
        }
    }
}
function authToken() {
    return store.getState().auth.user?.token;
}
