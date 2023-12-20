import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import Loading from "./common/Loading";
import { IProduct } from "../interfaces/IProduct";
import Product from "./Product";
import useAuth from "../hooks/authCheck";
import {
    GET_BOUGHT_PRODUCTS,
    GET_SOLD_PRODUCTS,
    GET_BORROWED_PRODUCTS,
    GET_LENT_PRODUCTS,
} from "../graphql/queries";

interface Props {
    type: "Bought" | "Sold" | "Borrowed" | "Lent";
}

const DashboardProducts = ({ type }: Props) => {
    const { user } = useAuth();

    const getQueryByType = () => {
        switch (type) {
            case "Bought":
                return GET_BOUGHT_PRODUCTS;
            case "Sold":
                return GET_SOLD_PRODUCTS;
            case "Borrowed":
                return GET_BORROWED_PRODUCTS;
            case "Lent":
                return GET_LENT_PRODUCTS;
            default:
                throw new Error(`Invalid type: ${type}`);
        }
    };

    const { loading, data } = useQuery(getQueryByType(), {
        variables: { userId: user?.id },
        skip: !user?.id,
    });

    const productsKey = `get${type}Products`;

    const products: IProduct[] = useMemo(() => {
        if (!data?.[productsKey]?.length) return [];
        return data?.[productsKey];
    }, [data, productsKey]);

    return (
        <div className="container mx-auto p-10">
            {loading ? (
                <Loading className="w-8 h-8" />
            ) : (
                <div className="flex flex-col space-y-4">
                    {products?.length ? (
                        products?.map((product: IProduct) => (
                            <Product key={product.id} userId={user?.id} product={product} />
                        ))
                    ) : (
                        <p className="text-gray-900 text-center text-xl my-10">
                            No products found!
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default DashboardProducts;
