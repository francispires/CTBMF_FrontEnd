// A mock function to mimic making an async request for data
import { fetchWrapper } from '../../../_helpers';
export function fetchAllUsers(limit=10,page=1,sort="created_at:1") {
  return fetchWrapper.get(`users?limit=${limit}&page=${page}&sort=${sort}`,{});
}
export function logout() {

  const baseUrl = `${"http://localhost:4040"}/users`;
  return  fetchWrapper.post(`${baseUrl}/logout`,{});
}
export function login( username:string, password:string ) {

  const baseUrl = `${"http://localhost:4040"}/users`;
  return  fetchWrapper.post(`${baseUrl}/authenticate`, { username, password });
}
