import { useEffect, useState } from 'react'
import { WalletComponent } from '@/components/wallet'
import Layout from '@/layout/Sidebar'
import Store from '@/store/store'
import { getTransactions,getWallet } from '@/services/advisor/advisorService'

export default function UserWallet() {
    const advisorId = Store((state) => state.user._id)
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [wallet,setWallet] = useState({})

    useEffect(() => {
        fetchTransactions();
    }, []);
    useEffect(()=>{
        fetchUserWallet()
    },[])
    const fetchTransactions = async () => {
        try{
            setLoading(true)
            const response = await getTransactions(advisorId)
            setTransactions(response.transactions)
        }catch(err){
            console.error("Error fetching transactions : ",err)
        }finally{
            setLoading(false)
        }
    }
    const fetchUserWallet = async()=>{
        try{
            const response = await getWallet(advisorId)
            setWallet(response)
        }catch(err){
            console.error(err)
        }
    }
    return (
        <Layout role='user'>
            <div className="container mx-auto p-4 max-w-6xl">
                <div className="">
                    {/* Advisor Wallet */}
                    <WalletComponent transactions={transactions} loading={loading} wallet={wallet}/>

                </div>
            </div>
        </Layout>
    )
}