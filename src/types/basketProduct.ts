type ProductType = "reservation" | "product";

interface IBasketProduct {
    id: number;
    name: string;
    price: number;
    quantity: number;
    type: ProductType;
}

export type { IBasketProduct };