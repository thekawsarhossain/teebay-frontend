import Product from "../Components/Product";
import useAuth from "../hooks/authCheck";
import { useQuery } from "@apollo/client";
import { GET_ALL_PRODUCTS } from "../graphql/queries";
import Loading from "../Components/common/Loading";
import { IProduct } from "../interfaces/IProduct";
import { useMemo } from "react";

const AllProducts = () => {
    const { user } = useAuth();

    const { loading, data } = useQuery(GET_ALL_PRODUCTS);

    const products = useMemo(() => {
        if (!data?.getAllProducts?.length) return [];
        return data?.getAllProducts
    }, [data?.getAllProducts])


    return (
        <div className="p-4">
            {/* list all products */}
            <div className="container mx-auto p-10">
                <h2 className="text-2xl font-medium mb-6 uppercase text-black text-center">
                    ALL PRODUCTS
                </h2>
                {loading ? <Loading className="w-8 h-8" />
                    : <div className="flex flex-col space-y-4">
                        {products?.length ? products?.map((product: IProduct) => (
                            <Product key={`all_poducts_${product.id}`} userId={user.id} product={product} to={"product"} />
                        )) : <p className="text-gray-900 text-center text-xl my-10">No products found!</p>
                        }
                    </div>
                }
            </div>
        </div>
    );
};

export default AllProducts;