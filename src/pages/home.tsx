import { useNavigate } from "react-router-dom";
import Button from "../Components/common/Button";
import client from "../config/apolloClient";
import Product from "../Components/Product";

const Home = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
        client.resetStore();
        localStorage.removeItem("userId");
        navigate("/login")
    }

    return (
        <div className="p-4">
            <div className="flex justify-end">
                <Button onClick={handleLogout} kind="danger" className="uppercase">Logout</Button>
            </div>

            {/* list products */}
            <div className="container mx-auto p-10">
                <Product />
            </div>
        </div>
    );
};

export default Home;