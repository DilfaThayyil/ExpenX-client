import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"

const WithNavbar = ()=>{
    return (
        <>
        <Navbar/>
        <Outlet/>
        </>
    )
}

export default WithNavbar