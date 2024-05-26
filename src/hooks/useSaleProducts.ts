import { useState, useEffect } from "react";
import type { ISaleProduct } from "../types/saleProduct";

function useSaleProducts() {
  const [saleProducts, setSaleProducts] = useState<ISaleProduct[]>([]);
  const url = import.meta.env.VITE_API_URL;

  async function getAll() {
    try {
      const response = await fetch(`${url}/sale-products`);
      const data = await response.json();
      setSaleProducts(data);
    } catch (error) {
      console.error(error);
    }
  }

    useEffect(() => {
        getAll();
    }, []);

  async function getById(id: number) {
    try {
      const response = await fetch(`${url}/sale-products/${id}`);
      if (response.status === 404) {
        return null;
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  async function add(name: string, price: number) {
    try {
      const response = await fetch(`${url}/sale-products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id:0, name: name, price: price }),
      });
      if (response.status === 201) {
        return await response.json();
      }
    } catch (error) {
      console.error(error);
    }
  }

  return { saleProducts, setSaleProducts, getById, add };
}

export default useSaleProducts;
