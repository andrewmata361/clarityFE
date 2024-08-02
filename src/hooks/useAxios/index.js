import axios from 'axios';
import { useState, useEffect } from 'react';

const useAxios = () => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const axiosI = axios.create({
        baseURL: "https://localhost:7232",
    });
    axiosI.interceptors.request.use((config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    });

    axiosI.interceptors.response.use((response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    });        
        const fetchData = async ({url, method, data = {}, params = {}}) => {
            setLoading(true);

            try {
                const response = await axiosI({
                    url,
                    method,
                    data,
                    params,
                }).then(data => { 
                    setResponse(data.data ) });
            } catch (error) {
                setError(error.response ? error.response.data : error.message);
            } finally {
                setLoading(false);
            }
        };
    return { response, error, loading, fetchData };
};
export default useAxios
