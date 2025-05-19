import AuthComponent from '../components/AuthComponent'
import { useState,useContext } from 'react'
import { LoginUrl } from '../utils/network'
import { tokenname } from '../utils/data'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/hooks'
import { axiosrequest } from '../utils/functions'
import { notification } from 'antd'
import { store } from '../utils/store'

const Login=()=>{

    const {state:{user}}=useContext(store)
    const username=user?.userName? user.userName:""

    const [loading,setLoading]=useState(false)

    const navigate= useNavigate()

    console.log('hello')
    useAuth({
        successCallBack:(username)=>{
            if(username==="Student")
            {navigate("/student")}
            else{navigate("/recruiter")}
        }
    })
    
    const onSubmit=async(values)=>{
        setLoading(true)

        const response= await axiosrequest({
            method:'post',
            url:LoginUrl,
            payload:values,
            errorObject:{message:"Login error"}
        })
        
        if(response){
            if(response.data.ResponseCode!==200){
                notification.error({
                   message: "Operation Error",
                   description: response.data.Respmessage
                })
            }
            else{
            console.log(response)
            localStorage.setItem(tokenname,response.data.Data.JwtToken)
            response.data.Data.role==="Student"? navigate("/student"):navigate("/recruiter")
            }
        }
        setLoading(false)
    }

    return <AuthComponent title="Sign In" onSubmit={onSubmit} loading={loading}/>
}

export default Login
