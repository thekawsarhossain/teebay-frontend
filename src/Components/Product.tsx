import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react';
import Button from './common/Button';
import { IProduct } from '../interfaces/IProduct';
import { Reference, StoreObject, useMutation } from '@apollo/client';
import { DELETE_PRODUCT } from '../graphql/mutations';
import { GET_USER_PRODUCTS } from '../graphql/queries';
import { CATEGORIES } from '../constants/categories';
import { RENT_OPTIONS } from '../constants/rentOptions';

interface SelectedProduct {
    id: string;
    ownerId: string
}

const Product = ({ product, userId }: { product: IProduct, userId: string }) => {
    const [isOpenDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedForDelete, setSelected] = useState<SelectedProduct>({ id: "", ownerId: "" });

    const { id, title, description, price, rentPrice, rentOption, categories, createdAt, owner } = product || {};

    return (
        <div className='border p-10'>
            <div className="flex justify-between items-center">
                <h2 className="text-xl">{title}</h2>
                {userId === owner.id && <button onClick={() => {
                    setSelected({ id, ownerId: owner.id })
                    setOpenDeleteModal(true);
                }}>
                    <img src="/images/delete.png" alt="delete" className="w-10 h-10" />
                </button>}
            </div>
            <p className="text-gray-500 mt-4">Categories: {categories.map((category) => CATEGORIES[category]).join(", ")}</p>
            <p className="text-gray-500 my-3">Price: ${price} | Rent: ${rentPrice} {RENT_OPTIONS[rentOption]}</p>
            <p>{description}</p>
            <p className="text-sm text-gray-500 mt-6">Date posted: {new Date(Number(createdAt)).toDateString()}</p>
            <DeleteProductDialog isOpen={isOpenDeleteModal} selectedProduct={selectedForDelete} close={() => setOpenDeleteModal(false)} />
        </div>
    );
};

export default Product;

interface Props {
    isOpen: boolean;
    close: () => void;
    selectedProduct: SelectedProduct;
}

function DeleteProductDialog({ isOpen, selectedProduct, close }: Props) {
    const [deleteProduct, { loading }] = useMutation(DELETE_PRODUCT);

    const handleDelete = () => {
        deleteProduct({
            variables: { productId: selectedProduct.id },
            update(cache) {
                cache.modify({
                    id: cache.identify({
                        __typename: 'Product',
                        id: selectedProduct.id,
                    }),
                    fields: {
                        products(existingProducts = [], { readField }) {
                            return existingProducts.filter(
                                (productRef: Reference | StoreObject | undefined) => selectedProduct.id !== readField('id', productRef)
                            );
                        },
                    },
                });
            },
            refetchQueries: [{ query: GET_USER_PRODUCTS, variables: { userId: selectedProduct.ownerId } }],
        })
            .then(() => close())
            .catch(err => {
                console.log("Delete product error", err)
            });
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={close}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden bg-white py-10 px-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-xl font-medium leading-8 text-gray-900"
                                >
                                    Are you sure you want to delete this product?
                                </Dialog.Title>

                                <div className="mt-4 flex items-center space-x-4 justify-end">
                                    <Button kind='danger' onClick={close}>No</Button>
                                    <Button loading={loading} onClick={handleDelete}>Yes</Button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}