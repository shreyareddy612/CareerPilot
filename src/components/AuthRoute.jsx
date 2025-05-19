import { useState } from "react"
import { Outlet } from "react-router-dom"
import { Logout } from "../utils/functions"
import { useAuth } from "../utils/hooks"
import Layout from "./Layout"
import { Loading } from "./Loading"

export const AuthRoute=()=> {
  const [loading,setLoading]=useState(true)

    useAuth({
        errorCallBack:()=>{
            Logout()
        },
        successCallBack:()=>{
            setLoading(false)
        }
    })

    if(loading){
        return <Loading/>
    }

    return <Layout><Outlet/></Layout>
}
