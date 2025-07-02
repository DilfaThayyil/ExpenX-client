import { useEffect, useState } from 'react'
import { getTransactions,getWallet } from '@/services/advisor/advisorService'
import { WalletComponent } from '@/components/wallet'
import Layout from '@/layout/Sidebar'
import {WalletType} from './types'
import Store from '@/store/store'


export default function UserWallet() {
    const userId = Store((state) => state.user._id)
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [wallet, setWallet] = useState<WalletType>({ balance: 0 });

    useEffect(() => {
        fetchTransactions();
    }, []);
    useEffect(()=>{
        fetchUserWallet()
    },[])
    const fetchTransactions = async () => {
        try{
            setLoading(true)
            const response = await getTransactions(userId)
            setTransactions(response.transactions)
        }catch(err){
            console.error("Error fetching transactions : ",err)
        }finally{
            setLoading(false)
        }
    }
    const fetchUserWallet = async()=>{
        try{
            const response = await getWallet(userId)
            setWallet(response)
        }catch(err){
            console.error(err)
        }
    }
    return (
        <Layout role='user'>
            <div className="container mx-auto p-4 max-w-6xl">
                <div className="">
                    <WalletComponent transactions={transactions} loading={loading} wallet={wallet}/>
                </div>
            </div>
        </Layout>
    )
}