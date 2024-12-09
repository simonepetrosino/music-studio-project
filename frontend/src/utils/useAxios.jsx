import axios from 'axios';
import  {jwtDecode}  from "jwt-decode";
import dayjs from 'dayjs';
import { useContext } from 'react';
import {AuthContext} from '../context/AuthContext';


const baseURL = 'http://127.0.0.1:8000';


const useAxios = () => {
    const { authTokens, setUser, setAuthTokens } = useContext(AuthContext); //we want to update these when we refresh the token

    //a difference between this and axiosInstance is that we dont have to take authTokens from local storage, we can just use the context

    const axiosInstance = axios.create({
        baseURL: baseURL,
        headers: {
            Authorization: `Bearer ${authTokens?.access}`
        }
    });

    axiosInstance.interceptors.request.use(async req => { // this is a middleware that will run before every request
        // we dont need to check if authTokens is null, because we are using the context
    
        const user = jwtDecode(authTokens.access);
        const isExpired = dayjs.unix(user.exp).isBefore(dayjs());
        if (!isExpired) return req;
    
        const response = await axios.post(`${baseURL}/api/token/refresh/`, {
            refresh: authTokens.refresh
        });
    
        localStorage.setItem('authTokens', JSON.stringify(response.data));

        // another difference is that after we set local storage, we also want to update the context

        setAuthTokens(response.data);
        setUser(jwtDecode(response.data.access));


        req.headers.Authorization = `Bearer ${response.data.access}`;
    
        return req
    });

    return axiosInstance;
}

export default useAxios;