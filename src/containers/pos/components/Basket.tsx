import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {TransactionModal} from "../../../components/Modal";
import type { IBasketProduct } from "../../../types/basketProduct";
import useTransactions from "../../../hooks/useTransactions";
import { ITransaction } from "../../../types/transaction";
import { MdControlPoint, MdOutlineCancel } from "react-icons/md";

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
        <div className="flex justify-center">
            <button 
                className="bg-green-600 border-zinc-500 border cursor-pointer text-black text-center py-2 px-4 my-3 mx-10 rounded-md hover:bg-zinc-50 w-1/5 font-semibold"
                onClick={() => {
                    handleCreateTransaction();
                }}
            >
                Pay
            </button>
            <button 
                className="bg-zinc-300 border-zinc-500 border cursor-pointer text-black text-center py-2 px-4 my-3 mx-10 rounded-md hover:bg-zinc-50 w-1/5 font-semibold"
                onClick={() => setBasket([])}
            >
                Clear
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
            <div className="flex bg-white border border-zinc-400 rounded-lg w-2/3 p-2.5 m-2.5">
                <div className="w-1/3 ">{basketProduct.name}:</div>
                <div className="w-1/3 text-center">{basketProduct.price},-</div>
                <div className="w-1/3 text-center">{basketProduct.quantity}</div>
            </div>
            <div className="flex w-1/3 items-end">
                {basketProduct.type === "product" &&
                    <button 
                        className='bg-green-600 border-zinc-500 border cursor-pointer text-black text-center py-2 px-4 my-3 mx-2 rounded-md hover:bg-zinc-50 w-1.5/5'
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
                        <MdControlPoint/>
                    </button>
                }
                
                <button 
                    className='bg-red-500 border-zinc-500 border cursor-pointer text-black text-center py-2 px-4 my-3 rounded-md hover:bg-zinc-50 w-1.5/5'
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
                    <MdOutlineCancel/>
                </button>
            </div>
        </div>
    )
}

interface IBasketProps {
    basket: IBasketProduct[];
    setBasket: Dispatch<SetStateAction<IBasketProduct[]>>;
    setBookingPaid: (id: number) => void;
}

function Basket({basket, setBasket, setBookingPaid}: IBasketProps) {
    const { create } = useTransactions();
    const [showTransactionModal, setTransactionModal] = useState(false);
    const [transaction, setTransaction] = useState<ITransaction>({amount: 0});

    useEffect(() => {
        if (transaction.amount > 0) {
            basket.forEach((basketProduct) => {
                if (basketProduct.type === "reservation") {
                    setBookingPaid(basketProduct.id);
                }
            });
            create(transaction);
            setTransactionModal(true);
        } 
    }, [transaction]);

    function onTransactionModalClose() {
        setTransactionModal(false);
        setBasket([]);
    }

    return (
        <>
            {showTransactionModal && 
                <TransactionModal
                    onClose={onTransactionModalClose}
                    transaction={transaction}
                />
            }
            <div className="flex flex-col border border-zinc-400 rounded-md w-full bg-zinc-100">
                <div className="p-2.5 m-2.5 font-bold text-lg text-center">
                    Basket
                </div>
                <div className="flex flex-col mb-2">
                    <div className="flex w-2/3 p-2.5 m-2.5">
                        <div className="w-1/3 font-bold">Product:</div>
                        <div className="w-1/3 font-bold text-center">Price:</div>
                        <div className="w-1/3 font-bold text-center">Quantity:</div>
                    </div>
                    {
                        basket.map((basketProduct) => {
                            return <BasketProduct key={basketProduct.id} basketProduct={basketProduct} setBasket={setBasket}/>
                        })
                    }
                </div>
                    
                <BasketButton basket={basket} setBasket={setBasket} setTransaction={setTransaction}/>
                </div>
        </>
    )
}

export default Basket;