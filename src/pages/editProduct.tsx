import { useParams } from "react-router-dom";
import { Form, FormField, FormInputFuncProps } from "../Components/common/Form";
import { useEffect, useState } from "react";
import MultiSelect from "../Components/common/MultiSelect";
import { CATEGORIES } from "../constants/categories";
import { RENT_OPTIONS } from "../constants/rentOptions";
import Button from "../Components/common/Button";
import { useQuery } from "@apollo/client";
import { GET_PRODUCT } from "../graphql/queries";
import Loading from "../Components/common/Loading";

const EditProduct = () => {
    const { productId } = useParams();

    const { loading: productLoading, data: oldProductData } = useQuery(GET_PRODUCT, {
        variables: { id: productId },
        skip: !productId,
    });

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: 0,
        rentPrice: 0,
        rentOption: ''
    });
    const [selectedCategories, setSelectedCategories] = useState<{ key: string; value: string }[]>([]);

    useEffect(() => {
        oldProductData?.getProduct?.categories?.forEach((category: string) => {
            setSelectedCategories([...selectedCategories, { key: category, value: CATEGORIES[category] }]);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [oldProductData?.getProduct?.categories])

    const handleSubmit = async (data: Record<string, string>) => {
        console.log(data)
        // const prices = {
        //     price: Number(parseFloat(data.price).toFixed(2)),
        //     rentPrice: Number(parseFloat(data.rentPrice).toFixed(2))
        // };

        // // addProduct({
        // //     variables: { product: { ...data, ...prices, categories: (selectedCategories.map(category => category.key)), ownerId: user.id } },
        // //     update: (cache, { data: { addProduct } }) => {
        // //         const currentData: { products: IProduct[] } = cache.readQuery({ query: GET_USER_PRODUCTS }) || { products: [] };

        // //         let products: IProduct[] = [];
        // //         if (currentData && currentData?.products) {
        // //             products = [...currentData.products];
        // //         }
        // //         cache.writeQuery({
        // //             query: GET_USER_PRODUCTS,
        // //             data: {
        // //                 products: [...products, addProduct],
        // //             },
        // //         });
        // //     },
        // // })
        // //     .then(() => navigate("/"))
    };

    const handleChange = (e: { target: { name: string; value: string | number; }; }) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div className="w-full md:w-3/4 lg:w-2/4 mx-auto">
            {productLoading ?
                <div className="h-screen flex items-center justify-center">
                    <Loading className="w-8 h-8" />
                </div> :
                <Form model={{ ...oldProductData?.getProduct }} onSubmit={handleSubmit} className="flex flex-col items-center justify-center h-screen px-2 md:px-0">
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
                                        className={`shadow-sm block px-3 py-2 border rounded-md placeholder-gray-400 sm:text-sm focus:outline-none focus:border-indigo-600 ${errors ? "border-red-600" : ""}`}
                                    >
                                    </textarea>
                                    {errors && (<p className="text-xs text-error-red">{errors.message}</p>)}
                                </div>
                            )}
                        </FormField>
                    </div>

                    <div className="w-full mt-6 flex items-center space-x-4">
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
                                        className={`shadow-sm block px-3 py-2 border rounded-md placeholder-gray-400 sm:text-sm focus:outline-none focus:border-indigo-600 ${errors ? "border-red-600" : ""}`}
                                    />
                                )}
                            </FormField>
                        </div>

                        <div className="flex flex-col gap-2">
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
                                        className={`shadow-sm block px-3 py-2 border rounded-md placeholder-gray-400 sm:text-sm focus:outline-none focus:border-indigo-600 ${errors ? "border-red-600" : ""}`}
                                    >
                                        <option value="" hidden>Select option</option>
                                        {Object.entries(RENT_OPTIONS || {}).map(([key, value]) => (
                                            <option key={key} value={key}>{value}</option>
                                        ))}
                                    </select>
                                )}
                            </FormField>
                        </div>
                    </div>
                    <div className='mt-10 flex justify-end w-full'>
                        <Button type='submit'>Edit Product</Button>
                    </div>
                </Form>
            }
        </div>
    );
};

export default EditProduct;