import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4000/',
    withCredentials: true
})

api.interceptors.response.use(
    response => (response), 
    error => (Promise.reject(error.response.data.err))
);

export default api;