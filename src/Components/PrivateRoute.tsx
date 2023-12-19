import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import Loading from "./common/Loading";
import useAuth from "../hooks/authCheck";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
    const { loading, user } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center h-screen"><Loading className="w-12 h-12" /></div>
    }

    return user?.id ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
