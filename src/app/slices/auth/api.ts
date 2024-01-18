// A mock function to mimic making an async request for data
import { fetchWrapper } from '../../../_helpers';

export function logout() {
  const baseUrl = `${"http://localhost:4040"}/users`;
  return  fetchWrapper.post(`${baseUrl}/logout`,{});
}
export function login( username:string, password:string ) {
  const baseUrl = `${"http://localhost:4040"}/users`;
  return  fetchWrapper.post(`${baseUrl}/authenticate`, { username, password });
}
