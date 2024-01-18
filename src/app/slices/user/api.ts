import {fetchWrapper} from '../../../_helpers';
import {get} from "../../../_helpers/api.ts";

export async function fetchAllUsers(request: PagedRequest) {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL;
    const url = `${apiUrl}/users/all?page=${(Number(request.currentPage))}&sort=${request.sort}&perpage=${request.pageSize}&includeTotals=true`;
    return await get<PagedResponse<AuthUser>>(url);
}
export function logout() {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL;
    return  fetchWrapper.post(`${apiUrl}/logout`,{});
}
export function login( username:string, password:string ) {
  const baseUrl = `${import.meta.env.VITE_REACT_APP_API_SERVER_URL}/users`;
  return  fetchWrapper.post(`${baseUrl}/authenticate`, { username, password });
}
