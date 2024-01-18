import {fetchWrapper} from '../../../_helpers';
import {get} from "../../../_helpers/api.ts";

export async function fetchAllUsers(request: PagedRequest) {
    const apiUrl = "http://localhost:6060/api";
    const url = `${apiUrl}/users/all?page=${(Number(request.currentPage))}&sort=${request.sort}&perpage=${request.pageSize}&includeTotals=true`;
    return await get<PagedResponse<AuthUser>>(url);
}
export function logout() {
    const apiUrl = "http://localhost:6060/api";
    return  fetchWrapper.post(`${apiUrl}/logout`,{});
}
export function login( username:string, password:string ) {
  const baseUrl = `${"http://localhost:6060"}/users`;
  return  fetchWrapper.post(`${baseUrl}/authenticate`, { username, password });
}
