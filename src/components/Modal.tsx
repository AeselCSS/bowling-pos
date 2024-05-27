import { PropsWithChildren, useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { ITransaction } from "../types/transaction";

interface IConfirmModalProps {
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    onConfirm: () => void;
}

function ConfirmModal({ setIsOpen, onConfirm }: IConfirmModalProps) {
    return (
        <Modal>
            <div className="text-center">
                <h2 className="text-2xl font-bold">Are you sure?</h2>
                <div className="mt-4">
                    <button
                        onClick={onConfirm}
                        className="bg-red-500 text-white px-4 py-2 mr-2 rounded-md"
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => {
                            setIsOpen((prev) => !prev);
                        }}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                    >
                        No
                    </button>
                </div>
            </div>
        </Modal>
    );
}

interface ITransactionModalProps {
    transaction: ITransaction;
    onClose: () => void;
}

function TransactionModal({transaction, onClose}: ITransactionModalProps) {
    return (
        <Modal>
            <div className="flex flex-col text-center">
                <div className="text-2xl font-bold mb-5">Transaction successful</div>
                <div className="flex justify-center">
                    <div className="font-semibold mx-5">Amount:</div>
                    <div className="mx-5">{transaction.amount},-</div>
                </div>
                <div className="text-center mt-5">
                    <button
                        onClick={() => {
                            onClose();
                        }}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md w-1/5"
                    >
                        Close
                    </button>
                </div>
            
            </div>
        </Modal>
    );
}

interface IAddNewSaleProductModalProps{
    onAddNewSaleProduct: (name: string, price: number) => void;
    onClose: () => void;
}

function AddNewSaleProductModal({onAddNewSaleProduct, onClose}: IAddNewSaleProductModalProps){
    const [name, setName] = useState<string>("")
    const [price, setPrice] = useState<number>(0)
    return (
        <Modal>
            <div className="flex flex-col">
                <div className="text-2xl font-bold">Add new Sale product</div>
                <div className="flex mt-4 rounded-lg w-full p-2.5 m-2.5 justify-between">
                    <label htmlFor="name" className="font-semibold">Name: </label>
                    <input
                        type="text"
                        id="name"
                        className="border border-gray-300 rounded-md px-2 py-1"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="flex mt-4 rounded-lg w-full p-2.5 m-2.5 justify-between">
                    <label htmlFor="price" className="font-semibold">Price: </label>
                    <input
                        type="number"
                        id="price"
                        className="border border-gray-300 rounded-md px-2 py-1"
                        value={(price === 0) ? "" : price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                    />
                </div>
                
                <div className="mt-4 text-center">
                    
                    <button 
                        className="bg-green-600 border-zinc-500 border cursor-pointer text-black text-center py-2 px-4 my-3 mx-10 rounded-md hover:bg-zinc-50 w-1/5 font-semibold"
                        onClick={() => {
                            const name = (document.getElementById("name") as HTMLInputElement).value;
                            const price = Number((document.getElementById("price") as HTMLInputElement).value);
                            onAddNewSaleProduct(name, price);
                        }}
                    >
                        Add
                    </button>
                    <button 
                        className="bg-zinc-300 border-zinc-500 border cursor-pointer text-black text-center py-2 px-4 my-3 mx-10 rounded-md hover:bg-zinc-50 w-1/5 font-semibold"
                        onClick={() => onClose()}
                    >
                        Close
                    </button>
                </div>
            </div>
            
        </Modal>
    );

}


function Modal({ children }: PropsWithChildren) {
    return (
        <div className="fixed inset-0 flex items-center justify-center mt-20">
            <div className="bg-black bg-opacity-50 absolute inset-0 backdrop-blur-md"></div>
            <div className="bg-white p-8 rounded-md relative z-10 max-h-[800px] overflow-y-auto overscroll-none min-w-96">
                {children}
            </div>
        </div>
    );
}

export {Modal, ConfirmModal, TransactionModal, AddNewSaleProductModal};