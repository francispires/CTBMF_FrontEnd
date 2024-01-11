import {store} from "../app/store.ts";
export const fetchWrapper = {
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    delete: request('DELETE')
};

function request(method:string) {
    return (url:string, body:object) => {
        const requestOptions = {
            method,
            headers: authHeader(url),
            body: "",
            "Content-Type": "application/json"
        };
        if (body) {
            requestOptions["headers"]['Content-Type'] = 'application/json';
            requestOptions.body = JSON.stringify(body);
        }else{
            //delete requestOptions.body;
        }
        return fetch(url, requestOptions).then(handleResponse);
    }
}

// helper functions

function authHeader(url:string) {
    // return auth header with jwt if user is logged in and request is to the api url
    const token = authToken();
    const isLoggedIn = !!token;
    const isApiUrl = url.startsWith("http://localhost:4040");
    if (isLoggedIn && isApiUrl) {
        return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json',body:"" };
    } else {
        return { Authorization: ``, 'Content-Type': '',body:"" };
    }
}

function authToken() {
    return store.getState().auth.user?.token;
}

function handleResponse(response:Response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);

        if (!response.ok) {
            if ([401, 403].includes(response.status) && authToken()) {
                // // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                // const logout = () => store.dispatch(authActions.logout());
                // logout();
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}