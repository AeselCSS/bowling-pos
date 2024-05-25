import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {TransactionModal} from "../../../components/Modal";
import type { IBasketProduct } from "../../../types/basketProduct";
import useTransactions from "../../../hooks/useTransactions";
import { ITransaction } from "../../../types/transaction";

interface IBasketButtonProps {
    basket: IBasketProduct[];
    setBasket: Dispatch<SetStateAction<IBasketProduct[]>>;
    setTransaction: Dispatch<SetStateAction<ITransaction>>;
}

function BasketButton({basket, setBasket, setTransaction}: IBasketButtonProps) {

    function handleCreateTransaction() {
        const transaction: ITransaction = {amount: basket.reduce((acc, basketProduct) => acc + basketProduct.price * basketProduct.quantity, 0)};
        setTransaction(transaction);
    }

    return (
        <div>
            <button 
                className="bg-green-600 border-zinc-500 border cursor-pointer text-black text-center py-2 px-4 my-3 ml-10 rounded-md hover:bg-zinc-50 w-1/5"
                onClick={() => {
                    handleCreateTransaction();
                }}
            >
                Pay
            </button>
            <button 
                className="bg-red-600 border-zinc-500 border cursor-pointer text-black text-center py-2 px-4 my-3 ml-10 rounded-md hover:bg-zinc-50 w-1/5"
                onClick={() => setBasket([])}
            >
                Cancel
            </button>
        </div>
    )
}

interface IBasketProductProps {
    basketProduct: IBasketProduct;
    setBasket: Dispatch<SetStateAction<IBasketProduct[]>>;
}

function BasketProduct({basketProduct, setBasket}: IBasketProductProps) {
    return (
        <div className="flex flex-row w-full">
            <div>
                <div className="flex bg-white border border-zinc-400 rounded-lg w-96 p-2.5 m-1">
                    <div className="w-1/3 ">{basketProduct.name}:</div>
                    <div className="w-1/3 text-center">{basketProduct.price},-</div>
                    <div className="w-1/3 text-center">{basketProduct.quantity}</div>
                </div>
            </div>
            <div className="flex items-end">
                <button 
                    className='bg-green-500 border-zinc-500 border cursor-pointer text-black text-center py-2 px-4 my-3 ml-10 rounded-md hover:bg-zinc-50 w-1.5/5'
                    onClick={() => {
                        setBasket((prevBasket) => {
                            return prevBasket.map((prevBasketProduct) => {
                                if (prevBasketProduct.id === basketProduct.id) {
                                    return {...prevBasketProduct, quantity: prevBasketProduct.quantity + 1};
                                }
                                return prevBasketProduct;
                            });
                        });
                    }}
                > 
                    +
                </button>
                <button 
                    className='bg-red-500 border-zinc-500 border cursor-pointer text-black text-center py-2 px-4 my-3 ml-10 rounded-md hover:bg-zinc-50 w-1.5/5'
                    onClick={
                        () => {
                            setBasket((prevBasket) => {
                                return prevBasket.map((prevBasketProduct) => {
                                    if (prevBasketProduct.id === basketProduct.id) {
                                        return {...prevBasketProduct, quantity: prevBasketProduct.quantity - 1};
                                    }
                                    return prevBasketProduct;
                                }).filter((basketProduct) => basketProduct.quantity > 0);
                            });
                    }}
                >
                    -
                </button>
            </div>
        </div>
    )
}

interface IBasketProps {
    basket: IBasketProduct[];
    setBasket: Dispatch<SetStateAction<IBasketProduct[]>>;
}

function Basket({basket, setBasket}: IBasketProps) {
    const { create } = useTransactions();
    const [showTransactionModal, setTransactionModal] = useState(false);
    const [transaction, setTransaction] = useState<ITransaction>({amount: 0});

    useEffect(() => {
        if (transaction.amount > 0) {
            setTransactionModal(true);
            create(transaction);
            setBasket([]);
        }
    }, [transaction]);

    return (
        <>
            {showTransactionModal && (
                <TransactionModal
                    setIsOpen={setTransactionModal}
                    transaction={transaction}
                />
            )}
            <div className="flex flex-row border border-zinc-400 rounded-md w-5/6 bg-zinc-100">
                <div className="flex flex-col w-3/5">
                    <h2 className="text-lg font-bold m-2.5">Basket</h2>
                    <div className="flex flex-col">
                        {
                            basket.map((basketProduct) => {
                                return <BasketProduct key={basketProduct.id} basketProduct={basketProduct} setBasket={setBasket}/>
                            })
                        }
                    </div>
                    <BasketButton basket={basket} setBasket={setBasket} setTransaction={setTransaction}/>
                </div>
            </div>
        </>
    )
}

export default Basket;