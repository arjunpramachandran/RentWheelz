import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL 


export const api = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: true,
 
  headers: {'X-Custom-Header': 'foobar'},
});