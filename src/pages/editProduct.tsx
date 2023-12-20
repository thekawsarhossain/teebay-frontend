import { useNavigate, useParams } from "react-router-dom";
import { Form, FormField, FormInputFuncProps } from "../Components/common/Form";
import { useEffect, useMemo, useState } from "react";
import MultiSelect from "../Components/common/MultiSelect";
import { CATEGORIES } from "../constants/categories";
import { RENT_OPTIONS } from "../constants/rentOptions";
import Button from "../Components/common/Button";
import { useMutation, useQuery } from "@apollo/client";
import { GET_PRODUCT, GET_USER_PRODUCTS } from "../graphql/queries";
import Loading from "../Components/common/Loading";
import { arraysEqual } from "../utils/common";
import { ICategories, IProduct } from "../interfaces/IProduct";
import ErrorMessage from "../Components/common/ErrorMessage";
import { EDIT_PRODUCT } from "../graphql/mutations";
import useAuth from "../hooks/authCheck";

const EditProduct = () => {
    const { user } = useAuth();
    const { productId } = useParams();
    const navigate = useNavigate();

    const { loading: productLoading, data: productData } = useQuery(GET_PRODUCT, {
        variables: { id: productId },
        skip: !productId,
    });

    const [editProduct, { loading, error }] = useMutation(EDIT_PRODUCT);

    const [disableEditBtn, setDisable] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<{ key: string; value: string }[]>([]);
    const [formData, setFormData] = useState({ title: '', description: '', price: 0, rentPrice: 0, rentOption: '' });

    const product = useMemo(() => {
        if (!productData?.getProduct?.id) return {};
        return productData?.getProduct;
    }, [productData?.getProduct]);

    useEffect(() => {
        const { title, description, categories, price, rentPrice, rentOption } = product as IProduct || {};
        categories?.forEach((category: string) => {
            setSelectedCategories([...selectedCategories, { key: category, value: (CATEGORIES as unknown as ICategories)[category as unknown as number] }]);
        });
        setFormData({ title, description, price, rentPrice, rentOption })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product]);

    useEffect(() => {
        const prevCategories = product?.categories?.map((category: string) => ({ key: category, value: (CATEGORIES as unknown as ICategories)[category as unknown as number] }));

        if (formData.title === product.title && formData.description === product.description &&
            formData.price === product.price && formData.rentPrice === product.rentPrice &&
            formData.rentOption === product.rentOption && !arraysEqual(selectedCategories, prevCategories)
        ) setDisable(true);
        else setDisable(false)
    }, [formData, product, selectedCategories])

    const handleSubmit = async (data: Record<string, string>) => {
        const prices = {
            price: Number(parseFloat(data.price).toFixed(2)),
            rentPrice: Number(parseFloat(data.rentPrice).toFixed(2))
        };

        editProduct({
            variables: { productId, product: { ...data, ...prices, categories: (selectedCategories.map(category => category.key)) } },
            update: (cache, { data: { editProduct } }) => {
                const currentData: { getUserProducts: IProduct[] } = cache.readQuery({ query: GET_USER_PRODUCTS, variables: { userId: user?.id } }) || { getUserProducts: [] };
                const editedProductIndex = currentData.getUserProducts?.findIndex(product => product.id === editProduct.id);

                const updatedProducts = [...currentData.getUserProducts];
                updatedProducts[editedProductIndex] = editProduct;

                cache.writeQuery({
                    query: GET_USER_PRODUCTS,
                    variables: { userId: user?.id },
                    data: {
                        getUserProducts: updatedProducts,
                    },
                });
            },
        })
            .then(() => navigate("/"))
    };

    const handleChange = (e: { target: { name: string; value: string | number; }; }) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div className="w-full md:w-3/4 lg:w-2/4 mx-auto my-6">
            {productLoading ?
                <div className="h-screen flex items-center justify-center">
                    <Loading className="w-8 h-8" />
                </div> :
                <Form onSubmit={handleSubmit} className="flex flex-col items-center justify-center h-screen px-2 md:px-0">
                    <div className="w-full">
                        <label>Title</label>
                        <FormField
                            required
                            name="title"
                            type="text"
                        >
                            {({ errors, ...props }: FormInputFuncProps) => (
                                <div className="flex flex-col gap-2 w-full mt-2">
                                    <input
                                        {...props}
                                        onChange={handleChange}
                                        defaultValue={product?.title}
                                        className={`shadow-sm block px-3 py-2 border rounded-md placeholder-gray-400 sm:text-sm focus:outline-none focus:border-indigo-600 ${errors ? "border-red-600" : ""}`}
                                    />
                                    {errors && (<p className="text-xs text-error-red">{errors.message}</p>)}

                                </div>
                            )}
                        </FormField>
                    </div>
                    <div className="w-full mt-6">
                        <label>Categories</label>
                        <MultiSelect options={CATEGORIES} setSelectedOptions={setSelectedCategories} selectedOptions={selectedCategories} />
                    </div>
                    <div className="w-full mt-6">
                        <label>Description</label>
                        <FormField
                            required
                            name="description"
                            type='text'
                        >
                            {({ errors, ...props }: FormInputFuncProps) => (
                                <div className="flex flex-col gap-2 w-full mt-2">
                                    <textarea
                                        {...props}
                                        rows={10}
                                        onChange={handleChange}
                                        defaultValue={product?.description}
                                        className={`shadow-sm block px-3 py-2 border rounded-md placeholder-gray-400 sm:text-sm focus:outline-none focus:border-indigo-600 ${errors ? "border-red-600" : ""}`}
                                    >
                                    </textarea>
                                    {errors && (<p className="text-xs text-error-red">{errors.message}</p>)}
                                </div>
                            )}
                        </FormField>
                    </div>

                    <div className="w-full mt-6 flex flex-col md:flex-row items-center space-x-0 md:space-x-4 space-y-4 md:space-y-0">
                        <div className="flex flex-col gap-2 w-full">
                            <label>Price</label>
                            <FormField
                                required
                                name="price"
                                type="number"
                            >
                                {({ errors, ...props }: FormInputFuncProps) => (
                                    <input
                                        {...props}
                                        min={0}
                                        step="0.01"
                                        onChange={handleChange}
                                        defaultValue={product?.price}
                                        className={`shadow-sm block px-3 py-2 border rounded-md placeholder-gray-400 sm:text-sm focus:outline-none focus:border-indigo-600 ${errors ? "border-red-600" : ""}`}
                                    />
                                )}
                            </FormField>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <label>Rent</label>
                            <FormField
                                required
                                name="rentPrice"
                                type="number"
                            >
                                {({ errors, ...props }: FormInputFuncProps) => (
                                    <input
                                        {...props}
                                        min={0}
                                        step="0.01"
                                        onChange={handleChange}
                                        defaultValue={product?.rentPrice}
                                        className={`shadow-sm block px-3 py-2 border rounded-md placeholder-gray-400 sm:text-sm focus:outline-none focus:border-indigo-600 ${errors ? "border-red-600" : ""}`}
                                    />
                                )}
                            </FormField>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <label>Option</label>
                            <FormField
                                required
                                name="rentOption"
                                type="select"
                            >
                                {({ errors, ...props }: FormInputFuncProps) => (
                                    <select
                                        {...props}
                                        onChange={handleChange}
                                        defaultValue={product?.rentOption}
                                        className={`shadow-sm block px-3 py-2 border rounded-md placeholder-gray-400 sm:text-sm focus:outline-none focus:border-indigo-600 ${errors ? "border-red-600" : ""}`}
                                    >
                                        <option value="" hidden>Select option</option>
                                        {Object.entries(RENT_OPTIONS || {}).map(([key, value]) => (
                                            <option key={`edit_product__rent_option__${key}__${value}`} defaultValue={product?.rentOption} value={key}>{value}</option>
                                        ))}
                                    </select>
                                )}
                            </FormField>
                        </div>
                    </div>
                    {(error) && <ErrorMessage className='mt-4 w-full' error={error} />}
                    <div className='mt-10 flex justify-end w-full'>
                        <Button disabled={disableEditBtn || !selectedCategories.length || loading} loading={loading} type='submit'>Edit Product</Button>
                    </div>
                </Form>
            }
        </div>
    );
};

export default EditProduct;