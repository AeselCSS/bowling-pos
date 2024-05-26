import type { ISaleProduct } from "../../../types/saleProduct";
import type { IBasketProduct } from "../../../types/basketProduct";
import { MdControlPoint } from "react-icons/md";
import { Dispatch, SetStateAction, useState } from 'react';
import { AddNewSaleProductModal } from "../../../components/Modal";
import useSaleProducts from "../../../hooks/useSaleProducts";

interface SaleProductProps {
    saleProduct: ISaleProduct;
    onAddProduct: (saleProduct: ISaleProduct) => void;
}

function SaleProduct({saleProduct, onAddProduct}: SaleProductProps) {
    return (
        <div className="flex mb-2">
            <div className="flex bg-white border border-zinc-400 rounded-lg w-2/3 p-2.5 m-2.5">
                <div className="w-2/3 ">{saleProduct.name}:</div>
                <div className="w-1/3 text-center">{saleProduct.price},-</div>
            </div>
            <div className="flex items-end">
                <button 
                    className='bg-green-600 border-zinc-500 border cursor-pointer text-black text-center py-2 px-4 my-3 ml-10 rounded-md hover:bg-zinc-50 w-1.5/5'
                    onClick={() => onAddProduct(saleProduct)}
                >
                    <MdControlPoint/>
                </button>
            </div>
        </div>
    )
}

interface SaleProductsProps {
    saleProducts: ISaleProduct[];
    setSaleProducts: Dispatch<SetStateAction<ISaleProduct[]>>;
    setBasket: Dispatch<SetStateAction<(IBasketProduct)[]>>;
}

function SaleProducts({saleProducts, setSaleProducts, setBasket}: SaleProductsProps) {
    const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
    const {add} = useSaleProducts();

    function onAddProduct(saleProduct: ISaleProduct) {
        const basketProduct: IBasketProduct = {id: saleProduct.id, name: saleProduct.name, price: saleProduct.price, quantity: 1};
        setBasket((prevBasket) =>{
            if(prevBasket.find((basketProduct) => basketProduct.id === saleProduct.id)){
                return prevBasket.map((basketProduct) => {
                    if(basketProduct.id === saleProduct.id){
                        return {...basketProduct, quantity: basketProduct.quantity + 1};
                    }
                    return basketProduct;
                });
            }
            return [...prevBasket, basketProduct];
        });
    }

    async function onAddNewSaleProduct(name: string, price: number) {
        const newProduct = await add(name, price);
        setSaleProducts((prevSaleProducts) => [...prevSaleProducts, newProduct]);
        setIsSaleModalOpen(false);
    }

    return (
        <>
            {isSaleModalOpen && 
                <AddNewSaleProductModal onAddNewSaleProduct={onAddNewSaleProduct}/>  
            }
            <div className="flex flex-col border border-zinc-400 rounded-md min-w-96 w-full bg-zinc-100">
                <div className="p-2.5 m-2.5 font-bold text-lg text-center">
                    Sale products
                </div>
                <div>
                    <button 
                        onClick={() => {
                            setIsSaleModalOpen(true);
                        }}
                        className="bg-green-600 border-zinc-500 border cursor-pointer text-black text-center py-2 px-4 my-3 ml-10 rounded-md hover:bg-zinc-50 w-1/5"
                    >
                        Add
                    </button> 
                </div>
            </div>
            <div className="flex flex-col border border-zinc-400 rounded-md w-full bg-zinc-100">
                {saleProducts.map((saleProduct) => {
                    return <SaleProduct key={saleProduct.id} saleProduct={saleProduct} onAddProduct={onAddProduct}/>
                })}
            </div>
        </>
    )
}

export default SaleProducts;