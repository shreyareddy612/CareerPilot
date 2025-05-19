import {  useState,useContext } from 'react'
import AuthComponent from '../components/AuthComponent'
import { useAuth } from '../utils/hooks'
import { CreateUserUrl} from '../utils/network'
import { useNavigate } from 'react-router-dom'
import { axiosrequest } from '../utils/functions'
import { notification } from 'antd'
import { store } from '../utils/store'


const CheckUser=()=>{
    const [loading,setLoading]=useState(false)


     const {state:{user}}=useContext(store)
    const username=user?.userName? user.userName:""
    const navigate=useNavigate()

    useAuth({
        successCallBack:(username)=>{
            if(username==="Student")
            {navigate("/student")}
            else{navigate("/recruiter")}
        }
    })
    
    const onSubmit=async(values)=>{
        if(values["password"]!==values["cpassword"]){
            notification.error({
                message: "Invalid data",
                description: "Your password do not match"
            })
            return
        }
        setLoading(true)
        const response=await axiosrequest({
            url:CreateUserUrl,
            method:'post',
            payload:{...values},
            errorObject:{message:"User Check error", description:"Enter correct credentials"}
        })
        if(response){
            console.log(response)
            notification.success({
                   message: "Operation Succesful",
                   description: response.data.Respmessage
                })
            navigate("/login")
        }
        setLoading(false)
    }
    return <AuthComponent 
        title="Register Now!" 
        isPassword={true} 
        buttonText="Submit" 
        linkText="Go Back" 
        linkPath="/login"
        onSubmit={onSubmit}
        loading={loading}
        isUpdatePassword={true}
        role={true}
        firstname={true}
        lastname={true}
        phonenumber={true}
        email={true}
        />
}

export default CheckUser