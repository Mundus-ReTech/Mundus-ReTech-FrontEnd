import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '../apiClient.jsx';
import { useContext } from 'react';
import { DashboardContext } from '../../contexts/DashboardContext'; 
import { queryClient } from '../QueryClient.jsx';

const {username, password} = useContext(DashboardContext);
let params = {
    username : username,
    password : password
};

export const createDashboard = async (params) => {
    return await apiClient.post(process.env.CREATE_DASHBOARD_ENDPOINT_URL,{params});
};

export const useCreateDashboard = () => {
    const {mutate: submit, isLoading} = useMutation({
            mutationFn: () => createDashboard(params),
            onSuccess: (data) => {
                queryClient.invalidateQueries({ queryKey: ['createDashboard'] });   
                onSuccess?.(data);
            } 
        });
        return {submit, isLoading};
};



