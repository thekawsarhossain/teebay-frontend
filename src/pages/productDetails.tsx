import { useNavigate, useParams } from 'react-router-dom';
import { GET_BORROWED_PRODUCTS, GET_BOUGHT_PRODUCTS, GET_PRODUCT } from '../graphql/queries';
import { useMutation, useQuery } from '@apollo/client';
import Loading from '../Components/common/Loading';
import { useMemo, useState } from 'react';
import { IProduct } from '../interfaces/IProduct';
import { CATEGORIES } from '../constants/categories';
import { RENT_OPTIONS } from '../constants/rentOptions';
import Button from '../Components/common/Button';
import useAuth from '../hooks/authCheck';
import Modal from '../Components/common/Modal';
import { Dialog } from '@headlessui/react';
import { BUY_PRODUCT, RENT_PRODUCT } from '../graphql/mutations';
import ErrorMessage from '../Components/common/ErrorMessage';
import { Form, FormField, FormInputFuncProps } from '../Components/common/Form';
import { UseFormReturn } from 'react-hook-form';

const ProductDetails = () => {

    const { productId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate()

    const { loading, data } = useQuery(GET_PRODUCT, {
        variables: { id: productId },
        skip: !productId,
    });

    const product: IProduct = useMemo(() => {
        if (!data?.getProduct?.id) return {};
        return data?.getProduct
    }, [data?.getProduct])

    const [isOpen, setOpen] = useState({ buy: false, rent: false });

    return (
        <div className="container mx-auto p-10">
            {loading ?
                <div className="h-screen flex items-center justify-center">
                    <Loading className="w-8 h-8" />
                </div>
                :
                <div>
                    <h2 className="text-2xl">{product.title}</h2>

                    <p className="text-gray-500 mt-4">Categories: {product.categories?.map((category, index) => <span key={`product__${category}__${index}`} className='mr-2'>{`${CATEGORIES[category]}${product?.categories.length - 1 !== index ? "," : ""}`}</span>)}</p>

                    <p className="text-gray-500 my-3">Price: ${product.price} | Rent: ${product.rentPrice} {RENT_OPTIONS[product.rentOption]}</p>
                    <p>{product.description}</p>
                    <div className='mt-10 flex justify-end'>
                        {product?.owner?.id !== user?.id ? <div className='flex space-x-4'>
                            <Button onClick={() => setOpen({ buy: false, rent: true })}>Rent</Button>
                            <Button onClick={() => setOpen({ buy: true, rent: false })}>Buy</Button>
                        </div> :
                            <Button onClick={() => navigate("/products")}>Back</Button>}
                    </div>
                </div>
            }
            <BuyProductDialog isOpen={isOpen.buy} close={() => setOpen({ buy: false, rent: false })} product={product} buyerId={user?.id} />
            <RentProductDialog isOpen={isOpen.rent} close={() => setOpen({ buy: false, rent: false })} product={product} buyerId={user?.id} />
        </div>
    );
};

export default ProductDetails;

interface Props {
    isOpen: boolean;
    close: () => void;
    product: IProduct;
    buyerId: string;
}

function BuyProductDialog({ isOpen, product, close, buyerId }: Props) {
    const [buyProduct, { loading, error }] = useMutation(BUY_PRODUCT);
    const navigate = useNavigate();

    const handleBuying = () => {
        buyProduct({
            variables: { productId: product.id, buyerId },
            update: async (cache, { data: { buyProduct } }) => {
                const currentData = cache.readQuery({ query: GET_BOUGHT_PRODUCTS, variables: { userId: buyerId } });
                cache.writeQuery({
                    query: GET_BOUGHT_PRODUCTS,
                    variables: { userId: buyerId },
                    data: {
                        getBoughtProducts: [...(currentData as { getBoughtProducts: IProduct[] })?.getBoughtProducts ?? [], buyProduct?.product],
                    },
                });
            },
        })
            .then(() => navigate("/products"))
    };


    return (
        <Modal isOpen={isOpen} close={close}>
            <Dialog.Title
                as="h3"
                className="text-xl font-medium leading-8 text-gray-900"
            >
                Are you sure you want to buy this product?
            </Dialog.Title>

            {(error) && <ErrorMessage className='mt-2' error={error} />}

            <div className="mt-4 flex items-center space-x-4 justify-end">
                <Button kind='danger' onClick={close}>No</Button>
                <Button disabled={loading} loading={loading} onClick={handleBuying}>Yes</Button>
            </div>
        </Modal>
    )
}

function RentProductDialog({ isOpen, product, close, buyerId: renterId }: Props) {
    const [rentProduct, { loading, error }] = useMutation(RENT_PRODUCT);
    const navigate = useNavigate();
    const currentDate = new Date().toISOString().split("T")[0];

    const handleSubmit = async (data: Record<string, string>, form: UseFormReturn) => {
        const { startTime, endTime } = data || {};
        if (startTime && endTime && new Date(endTime) <= new Date(startTime)) {
            console.log("here ", )
            return form.setError("endTime", { type: "custom", message: "To date must be greater than From date" })
        }
        rentProduct({
            variables: { productId: product.id, renterId, startTime, endTime },
            update: async (cache, { data: { rentProduct } }) => {
                const currentData = cache.readQuery({ query: GET_BORROWED_PRODUCTS, variables: { userId: renterId } });
                cache.writeQuery({
                    query: GET_BORROWED_PRODUCTS,
                    variables: { userId: renterId },
                    data: {
                        getBorrowedProducts: [...(currentData as { getBorrowedProducts: IProduct[] })?.getBorrowedProducts ?? [], rentProduct?.product],
                    },
                });
            },
        })
            .then(() => navigate("/products"))
    };

    return (
        <Modal isOpen={isOpen} close={close}>
            <Dialog.Title
                as="h3"
                className="text-xl font-medium leading-8 text-gray-900"
            >
                Rental period
            </Dialog.Title>

            <Form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
                <div className='mt-6 flex flex-col md:flex-row justify-between space-x-0 md:space-x-4 space-y-4 md:space-y-0'>
                    <div className='w-full'>
                        <label>From</label>
                        <FormField
                            required
                            name="startTime"
                        >
                            {({ errors, ...props }: FormInputFuncProps) => (
                                <div className="flex flex-col gap-2 w-full">
                                    <input
                                        {...props}
                                        autoComplete="startTime"
                                        type='date'
                                        min={currentDate}
                                        className={`shadow-sm block w-full px-3 py-2 border rounded-md placeholder-gray-400 sm:text-sm focus:outline-none focus:border-indigo-600 ${errors ? "border-red-600" : ""}`}
                                    />
                                    {errors && (<p className="text-xs text-error-red">{errors.message}</p>)}
                                </div>
                            )}
                        </FormField>
                    </div>
                    <div className='w-full'>
                        <label>To</label>
                        <FormField
                            required
                            name="endTime"
                        >
                            {({ errors, ...props }: FormInputFuncProps) => (
                                <div className="flex flex-col gap-2 w-full">
                                    <input
                                        {...props}
                                        autoComplete="endTime"
                                        type='date'
                                        min={currentDate}
                                        className={`shadow-sm block w-full px-3 py-2 border rounded-md placeholder-gray-400 sm:text-sm focus:outline-none focus:border-indigo-600 ${errors ? "border-red-600" : ""}`}
                                    />
                                    {errors && (<p className="text-xs text-error-red">{errors.message}</p>)}
                                </div>
                            )}
                        </FormField>
                    </div>
                </div>

                {(error) && <ErrorMessage className='mt-2' error={error} />}

                <div className="mt-4 flex items-center space-x-4 justify-end">
                    <Button type='button' kind='danger' onClick={close}>Go Back</Button>
                    <Button type='submit' disabled={loading} loading={loading}>Confirm rent</Button>
                </div>
            </Form>
        </Modal>
    )
}