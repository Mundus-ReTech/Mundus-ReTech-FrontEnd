import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../lib/ApiClient";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

export const getDashboard = async (params) => {
    return await apiClient.get(process.env.GET_USER_ENDPOINT_URL, {params});
};

export const useGetDashboard = (params) => {
    const { data, isFetching, isFetched } = useQuery({
        queryKey: ['getDashboard', params],
        queryFn: () => getDashboard(params),
        enabled: !!params.username && !!params.password,
        
    });

    return { data, isLoading: isFetching, isFetched };
};