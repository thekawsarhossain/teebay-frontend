/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { GET_USER } from "../graphql/queries";

const useAuth = () => {
    const [userId, _setUserId] = useState(() => {
        return localStorage.getItem('userId') || "";
    })

    const { loading, data } = useQuery(GET_USER, {
        variables: { userId },
        skip: !userId,
    });

    return { loading, user: { ...data?.getUser } }
};

export default useAuth;
