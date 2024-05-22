import type { IBasketProduct } from "../../../types/basketProduct";



function BasketProduct({basketProduct}: {basketProduct: IBasketProduct}) {
    return (
        <div>
            <div className="flex bg-white border border-zinc-400 rounded-lg w-2/3 p-2.5 m-1">
                <div className="w-1/3 ">{basketProduct.name}:</div>
                <div className="w-1/3 text-center">{basketProduct.price},-</div>
                <div className="w-1/3 text-center">{basketProduct.quantity}</div>

            </div>
            
        </div>
    )

}

interface IBasketProps {
    basket: IBasketProduct[];
}

function Basket({basket}: IBasketProps) {
    return (
        <div className="flex flex-row border border-zinc-400 rounded-md w-5/6 bg-zinc-100">
            <div className="flex flex-col w-3/5">
                <h2 className="text-lg font-bold m-2.5">Basket</h2>
                <div className="flex flex-col">
                    {
                        basket.map((basketProduct) => {
                            return <BasketProduct key={basketProduct.id} basketProduct={basketProduct}/>
                        })
                    }
                </div>
            </div>
            
        </div>
    )
}

export default Basket;