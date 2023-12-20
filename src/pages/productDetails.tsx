import { useParams } from 'react-router-dom';
import { GET_PRODUCT } from '../graphql/queries';
import { useQuery } from '@apollo/client';
import Product from '../Components/Product';
import Loading from '../Components/common/Loading';
import { useMemo } from 'react';
import { IProduct } from '../interfaces/IProduct';
import { CATEGORIES } from '../constants/categories';
import { RENT_OPTIONS } from '../constants/rentOptions';
import Button from '../Components/common/Button';

const ProductDetails = () => {

    const { productId } = useParams();

    const { loading, data } = useQuery(GET_PRODUCT, {
        variables: { id: productId },
        skip: !productId,
    });

    const product: IProduct = useMemo(() => {
        if (!data?.getProduct?.id) return {};
        return data?.getProduct
    }, [data?.getProduct])

    return (
        <div className="container mx-auto p-10">
            {loading ?
                <div className="h-screen flex items-center justify-center">
                    <Loading className="w-8 h-8" />
                </div>
                :
                <div>
                    <h2 className="text-2xl">{product.title}</h2>
                    <p className="text-gray-500 mt-4">Categories: {product.categories.map((category) => CATEGORIES[category]).join(", ")}</p>
                    <p className="text-gray-500 my-3">Price: ${product.price} | Rent: ${product.rentPrice} {RENT_OPTIONS[product.rentOption]}</p>
                    <p>{product.description}</p>
                    <div className='mt-10 flex justify-end space-x-4'>
                        <Button >Rent</Button>
                        <Button>But</Button>
                    </div>
                </div>
            }
        </div>
    );
};

export default ProductDetails;