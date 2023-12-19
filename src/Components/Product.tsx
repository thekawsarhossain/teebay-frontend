import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react';
import Button from './common/Button';

const Product = () => {
    const [isOpenDeleteModal, setOpenDeleteModal] = useState(false);

    return (
        <div className='border p-10'>
            <div className="flex justify-between items-center">
                <h2 className="text-xl">Cricket Kit</h2>
                <button onClick={() => setOpenDeleteModal(true)}>
                    <img src="/images/delete.png" alt="delete" className="w-10 h-10" />
                </button>
            </div>
            <p className="text-gray-500 mt-4">Categories: Sporting Goods, Outdoor</p>
            <p className="text-gray-500 my-3">Price: $500 | Rent: $100 daily</p>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi quisquam, pariatur repellendus fuga repellat deleniti cumque iste perferendis dolorem fugit distinctio commodi doloribus est consectetur inventore natus vero ex quo!</p>
            <p className="text-sm text-gray-500 mt-6">Date posted: 21st August 2023</p>
            <DeleteProductDialog isOpen={isOpenDeleteModal} close={() => setOpenDeleteModal(false)} />
        </div>
    );
};

export default Product;

interface Props {
    isOpen: boolean;
    close: () => void;
}

function DeleteProductDialog({ isOpen, close }: Props) {
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
                                    <Button>Yes</Button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}