import { Dialog } from '@headlessui/react'
import { useState } from 'react';
import Button from './common/Button';
import { IProduct } from '../interfaces/IProduct';
import { useMutation } from '@apollo/client';
import { DELETE_PRODUCT } from '../graphql/mutations';
import { GET_USER_PRODUCTS } from '../graphql/queries';
import { CATEGORIES } from '../constants/categories';
import { RENT_OPTIONS } from '../constants/rentOptions';
import Modal from './common/Modal';
import { Link } from 'react-router-dom';

interface SelectedProduct {
    id: string;
    ownerId: string
}

const Product = ({ product, userId, to }: { product: IProduct, userId: string, to: string }) => {
    const [isOpenDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedForDelete, setSelected] = useState<SelectedProduct>({ id: "", ownerId: "" });

    const { id, title, description, price, rentPrice, rentOption, categories, createdAt, owner } = product || {};

    return (
        <div className='relative border p-10'>
            <Link to={`/${to}/${id}`} className='max-w-fit'>
                <h2 className="text-xl">{title}</h2>

                <p className="text-gray-500 mt-4">Categories: {categories.map((category, index) => <span key={`product__${category}__${index}`} className='mr-2'>{`${CATEGORIES[category]}${categories.length - 1 !== index ? "," : ""}`}</span>)}</p>

                <p className="text-gray-500 my-3">Price: ${price} | Rent: ${rentPrice} {RENT_OPTIONS[rentOption]}</p>
                <p>{description}</p>

                <p className="text-sm text-gray-500 mt-6">Date posted: {new Date(Number(createdAt)).toDateString()}</p>
                <DeleteProductDialog isOpen={isOpenDeleteModal} selectedProduct={selectedForDelete} close={() => setOpenDeleteModal(false)} />
            </Link>
            {userId === owner.id && <button className='absolute top-4 right-4' onClick={(event) => {
                event.stopPropagation();
                setSelected({ id, ownerId: owner.id })
                setOpenDeleteModal(true);
            }}>
                <img src="/images/delete.png" alt="delete" className="w-10 h-10" />
            </button>}
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
            update: async (cache) => {
                const currentData: { getUserProducts: IProduct[] } = cache.readQuery({ query: GET_USER_PRODUCTS, variables: { userId: selectedProduct.ownerId } }) || { getUserProducts: [] };

                if (currentData && currentData?.getUserProducts) {
                    const updatedProducts = currentData.getUserProducts.filter(
                        (product: IProduct) => product.id !== selectedProduct.id
                    );

                    cache.writeQuery({
                        query: GET_USER_PRODUCTS,
                        variables: { userId: selectedProduct.ownerId },
                        data: {
                            getUserProducts: updatedProducts,
                        },
                    });
                }
            }
        })
            .then(() => close())
            .catch((err) => {
                console.log("Delete product error", err);
            });
    };


    return (
        <Modal isOpen={isOpen} close={close}>
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
        </Modal>
    )
}