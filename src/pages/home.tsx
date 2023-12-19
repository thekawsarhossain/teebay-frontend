import { Link, useNavigate } from "react-router-dom";
import Button from "../Components/common/Button";
import client from "../config/apolloClient";
import Product from "../Components/Product";
import useAuth from "../hooks/authCheck";
import { useQuery } from "@apollo/client";
import { GET_USER_PRODUCTS } from "../graphql/queries";
import Loading from "../Components/common/Loading";
import { IProduct } from "../interfaces/IProduct";
import { useMemo } from "react";

const Home = () => {

    const { user } = useAuth();
    const navigate = useNavigate();

    const { loading, data } = useQuery(GET_USER_PRODUCTS, {
        variables: { userId: user?.id },
        skip: !user?.id,
    });

    const products = useMemo(() => {
        if (!data?.getUserProducts?.length) return [];
        return data?.getUserProducts
    }, [data?.getUserProducts])

    const handleLogout = () => {
        client.resetStore();
        localStorage.removeItem("userId");
        navigate("/login")
    }

    return (
        <div className="p-4">
            <div className="flex justify-end space-x-4">
                <Button onClick={() => navigate("/products")}>All Products</Button>
                <Button onClick={handleLogout} kind="danger" className="uppercase">Logout</Button>
            </div>

            {/* list my products */}
            <div className="container mx-auto p-10">
                <h2 className="text-2xl font-medium mb-6 uppercase text-black text-center">
                    MY PRODUCTS
                </h2>
                {loading ? <Loading className="w-8 h-8" />
                    : <div className="flex flex-col space-y-4">
                        {products?.length ? products?.map((product: IProduct) => (
                            <Link key={product.id} to={`/edit-product/${product.id}`}><Product userId={user?.id} product={product} /></Link>
                        )) : <p className="text-gray-900 text-center text-xl my-10">No products found!</p>
                        }
                    </div>
                }
                <div className="mt-6 flex justify-end">
                    <Button onClick={() => navigate("/create-product")}>Add Product</Button>
                </div>
            </div>
        </div>
    );
};

export default Home;