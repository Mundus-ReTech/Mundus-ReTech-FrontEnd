import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../lib/ApiClient";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";


export const body  = useContext(AuthContext);
export const createAuth = async ( body ) => {
    return await apiClient.get(process.env.CREATE_AUTH_ENDPOINT_URL, {body});
};

export const useCreateAuth = () => {

    const { data, isFetching, isFetched } = useQuery({
        queryKey: ['createAuth', body],
        queryFn: () =>  createAuth(body),
        enabled: !!body.username && !!body.password,
    });

    return { data, isLoading: isFetching, isFetched };
}