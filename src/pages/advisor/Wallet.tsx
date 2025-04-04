import { useEffect, useState } from 'react'
import { WalletComponent } from '@/components/wallet'
import Layout from '@/layout/Sidebar'
import Store from '@/store/store'
import { getTransactions } from '@/services/advisor/advisorService'

export default function AdvisorWallet() {
    const advisorId = Store((state) => state.user._id)
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try{
            setLoading(true)
            const response = await getTransactions(advisorId)
            console.log("res-transactions : ", response.transactions)
            setTransactions(response.transactions)
        }catch(err){
            console.error("Error fetching transactions : ",err)
        }finally{
            setLoading(false)
        }
    }
    return (
        <Layout role='advisor'>
            <div className="container mx-auto p-4 max-w-6xl">
                <div className="">
                    {/* Advisor Wallet */}
                    <WalletComponent transactions={transactions} loading={loading}/>

                </div>
            </div>
        </Layout>
    )
}