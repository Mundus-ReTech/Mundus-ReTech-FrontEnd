import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/ApiClient';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const {username, password} = useContext(AuthContext);
let params = {
    username : username,
    password : password
}

export const getAuth = async () => {
    return await apiClient.get(process.env.GET_AUTH_ENDPOINT_URL, {params});
};

export const useGetAuth = () => {
    const {data, isFetching, isFetched} = useQuery({
        queryKey: ['getAuth', params],
        queryFn: () => getAuth(params),
        enabled: !!params.username && !!params.password,
    });

    return { data, isLoading : isFetching, isFetched };
}


