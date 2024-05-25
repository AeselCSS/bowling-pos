import { useState } from "react";
import type { ITransaction } from "../types/transaction";
function useTransactions() {
    const [transaction, setTransaction] = useState<ITransaction>();
    const url = import.meta.env.VITE_API_URL;
    
    async function create(transaction: ITransaction) {
        try {
            const response = await fetch(`${url}/transactions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(transaction),
            });
            const data = await response.json();
            setTransaction(data);
        } catch (error) {
            console.error(error);
        }
    }
    
    return { create, transaction };

}

export default useTransactions;
