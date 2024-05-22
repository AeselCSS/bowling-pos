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

  return { saleProducts, getById };
}

export default useSaleProducts;
