import { useState } from 'react';
import { Form, FormField, FormInputFuncProps } from '../Components/common/Form';
import Button from '../Components/common/Button';
import MultiSelect from '../Components/common/MultiSelect';
import { CATEGORIES } from '../constants/categories';
import { RENT_OPTIONS } from '../constants/rentOptions';
import { useMutation } from '@apollo/client';
import { ADD_PRODUCT } from '../graphql/mutations';
import { GET_USER_PRODUCTS } from '../graphql/queries';
import ErrorMessage from '../Components/common/ErrorMessage';
import useAuth from '../hooks/authCheck';
import { useNavigate } from 'react-router-dom';
import { IProduct } from '../interfaces/IProduct';

const CreateProduct = () => {
    const [addProduct, { loading, error }] = useMutation(ADD_PRODUCT);
    const { user } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const nextStep = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setStep(step + 1);
    }
    const prevStep = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setStep(step - 1);
    }

    const [formData, setFormData] = useState({ title: '', description: '', price: 0, rentPrice: 0, rentOption: '' });
    const [selectedCategories, setSelectedCategories] = useState<{ key: string; value: string }[]>([]);

    const handleChange = (e: { target: { name: string; value: string | number; }; }) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleSubmit = async (data: Record<string, string>) => {
        const prices = {
            price: Number(parseFloat(data.price).toFixed(2)),
            rentPrice: Number(parseFloat(data.rentPrice).toFixed(2))
        };

        addProduct({
            variables: { product: { ...data, ...prices, categories: (selectedCategories.map(category => category.key)), ownerId: user.id } },
            update: async (cache, { data: { addProduct } }) => {
                const currentData = cache.readQuery({ query: GET_USER_PRODUCTS, variables: { userId: user?.id } });
                cache.writeQuery({
                    query: GET_USER_PRODUCTS,
                    variables: { userId: user?.id },
                    data: {
                        getUserProducts: [...(currentData as { getUserProducts: IProduct[] })?.getUserProducts ?? [], addProduct],
                    },
                });
            },
        })
            .then(() => navigate("/"))
    };

    const renderFormInputs = () => {
        switch (step) {
            case 1:
                return (
                    <div className='w-full md:w-3/4 lg:w-2/4'>
                        <h2 className='text-gray-900 text-xl md:text-3xl font-semibold text-center'>Select a title for your product</h2>
                        <FormField
                            required
                            name="title"
                            type="text"
                        >
                            {({ errors, ...props }: FormInputFuncProps) => (
                                <div className="flex flex-col gap-2 w-full mt-6">
                                    <input
                                        {...props}
                                        onChange={handleChange}
                                        className={`shadow-sm block px-3 py-2 border rounded-md placeholder-gray-400 sm:text-sm focus:outline-none focus:border-indigo-600 ${errors ? "border-red-600" : ""}`}
                                    />
                                    {errors && (<p className="text-xs text-error-red">{errors.message}</p>)}

                                </div>
                            )}
                        </FormField>
                        <div className='flex justify-end'>
                            <Button disabled={!formData.title} className='mt-10' onClick={nextStep}>Next</Button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className='w-full md:w-3/4 lg:w-2/4'>
                        <h2 className='text-gray-900 text-xl md:text-3xl font-semibold text-center'>Select categories</h2>
                        <div className="w-full mt-6">
                            <MultiSelect options={CATEGORIES} setSelectedOptions={setSelectedCategories} selectedOptions={selectedCategories} />
                        </div>
                        <div className='mt-10 flex justify-between'>
                            <Button onClick={prevStep}>Back</Button>
                            <Button disabled={!selectedCategories.length} onClick={nextStep}>Next</Button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className='w-full md:w-3/4 lg:w-2/4'>
                        <h2 className='text-gray-900 text-xl md:text-3xl font-semibold text-center'>Write product description</h2>
                        <FormField
                            required
                            name="description"
                            type='text'
                        >
                            {({ errors, ...props }: FormInputFuncProps) => (
                                <div className="flex flex-col gap-2 w-full mt-6">
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
                        <div className='mt-10 flex justify-between'>
                            <Button onClick={prevStep}>Back</Button>
                            <Button disabled={!formData.description} onClick={nextStep}>Next</Button>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className=''>
                        <h2 className='text-gray-900 text-xl md:text-3xl font-semibold text-center'>Select prices</h2>
                        <FormField
                            required
                            name="price"
                            type="number"
                        >
                            {({ errors, ...props }: FormInputFuncProps) => (
                                <div className="flex flex-col gap-2 w-full mt-6">
                                    <input
                                        {...props}
                                        min={0}
                                        step="0.01"
                                        onChange={handleChange}
                                        className={`shadow-sm block px-3 py-2 border rounded-md placeholder-gray-400 sm:text-sm focus:outline-none focus:border-indigo-600 ${errors ? "border-red-600" : ""}`}
                                    />
                                    {errors && (<p className="text-xs text-error-red">{errors.message}</p>)}
                                </div>
                            )}
                        </FormField>
                        <div className='mt-6'>
                            <label>Rent</label>
                            <div className='flex justify-between'>
                                <FormField
                                    required
                                    name="rentPrice"
                                    type="number"
                                >
                                    {({ errors, ...props }: FormInputFuncProps) => (
                                        <div className="flex flex-col gap-2 w-1/4">
                                            <input
                                                {...props}
                                                min={0}
                                                step="0.01"
                                                onChange={handleChange}
                                                className={`shadow-sm block px-3 py-2 border rounded-md placeholder-gray-400 sm:text-sm focus:outline-none focus:border-indigo-600 ${errors ? "border-red-600" : ""}`}
                                            />
                                            {errors && (<p className="text-xs text-error-red">{errors.message}</p>)}
                                        </div>
                                    )}
                                </FormField>
                                <FormField
                                    required
                                    name="rentOption"
                                    type="select"
                                >
                                    {({ errors, ...props }: FormInputFuncProps) => (
                                        <div className="flex flex-col gap-2 w-4/6">
                                            <select
                                                {...props}
                                                onChange={handleChange}
                                                className={`shadow-sm block px-3 py-2 border rounded-md placeholder-gray-400 sm:text-sm focus:outline-none focus:border-indigo-600 ${errors ? "border-red-600" : ""}`}
                                            >
                                                <option value="" hidden>Select option</option>
                                                {Object.entries(RENT_OPTIONS || {}).map(([key, value]) => (
                                                    <option key={`rent_option__${key}__${value}`} value={key}>{value}</option>
                                                ))}
                                            </select>
                                            {errors && (<p className="text-xs text-error-red">{errors.message}</p>)}
                                        </div>
                                    )}
                                </FormField>
                            </div>
                        </div>
                        <div className='mt-10 flex justify-between'>
                            <Button onClick={prevStep}>Back</Button>
                            <Button disabled={!formData.price || !formData.rentPrice || !formData.rentOption} onClick={nextStep}>Next</Button>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className='w-full md:w-3/4 lg:w-2/4'>
                        <h2 className='text-gray-900 text-xl md:text-3xl font-semibold'>Summary</h2>
                        <div className='flex flex-col space-y-4 mt-6'>
                            <span>Title: {formData.title}</span>

                            <span>Categories: {selectedCategories?.map((category, index) => <span key={`create_product__${category}__${index}`} className='mr-2'>{`${category.value}${selectedCategories.length - 1 !== index ? "," : ""}`}</span>)}</span>

                            <span>Description: {formData.description}</span>

                            <span>price: ${formData.price}, To rent: {formData.rentPrice} per {(RENT_OPTIONS as unknown as never)[formData.rentOption]}</span>
                        </div>
                        {(error) && <ErrorMessage className='mt-4' error={error} />}
                        <div className='mt-10 flex justify-between'>
                            <Button onClick={prevStep}>Back</Button>
                            <Button disabled={loading} loading={loading} type='submit'>Submit</Button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="flex items-center justify-center h-screen px-2 md:px-0">
            {renderFormInputs()}
        </Form>
    );
};

export default CreateProduct;
