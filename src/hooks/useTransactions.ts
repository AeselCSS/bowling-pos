import { useState } from "react";
import type { ITransaction } from "../types/transaction";
function useTransactions() {
    const [transaction, setTransaction] = useState<ITransaction>();
    const url = import.meta.env.VITE_API_URL;
    
    async function add(transaction: ITransaction) {
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
    
    return { add, transaction };

}

export default useTransactions;
