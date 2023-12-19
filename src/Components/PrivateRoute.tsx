/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery } from "@apollo/client";
import { Navigate } from "react-router-dom";
import { ReactNode, useState } from "react";
import Loading from "./common/Loading";
import { GET_USER } from "../graphql/queries";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
    const [userId, _setUserId] = useState(() => {
        return localStorage.getItem('userId') || "";
    })

    const { loading, data } = useQuery(GET_USER, {
        variables: { userId },
        skip: !userId,
    });

    if (loading) {
        return <div className="flex items-center justify-center h-screen"><Loading className="w-12 h-12" /></div>
    }

    return data?.getUser?.id ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
