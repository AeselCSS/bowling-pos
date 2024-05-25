import { PropsWithChildren } from "react";
import { Dispatch, SetStateAction } from "react";
import { ITransaction } from "../types/transaction";

interface ConfirmModalProps {
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    onConfirm: () => void;
}

function ConfirmModal({ setIsOpen, onConfirm }: ConfirmModalProps) {
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

function TransactionModal({transaction, setIsOpen}: {transaction:ITransaction, setIsOpen: Dispatch<SetStateAction<boolean>>}) {
    return (
        <Modal>
            <div className="text-center">
                <h2 className="text-2xl font-bold">Transaction successful</h2>
                <p>Amount: {transaction.amount}</p>
            </div>
            <button
                onClick={() => {
                    setIsOpen((prev) => !prev);
                }}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
            >
                Close
            </button>
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

export {Modal, ConfirmModal, TransactionModal};