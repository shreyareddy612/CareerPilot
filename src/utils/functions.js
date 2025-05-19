import { notification } from "antd"
import Axios from "axios"
import { tokenname } from "./data"
import { AllJobs, AppliedApplicantsUrl, AppliedJobsUrl, IsAuthorizedUrl, PostedJobsUrl } from "./network"

const instance = Axios.create({
    // baseURL: 'https://localhost:8080',
    
});

/******** Used for extracting JWT token from web browser local storage********/
export const getAuthToken=()=>{
    const accessToken=localStorage.getItem(tokenname)
    if(!accessToken){
        return null
    }
    console.log(accessToken)
    return {Token: accessToken }
}


/****** used for logout when user click logout button we are removing stored JWT token in web browser local storage,
  thus when any protected route is accessed it will rediect to login page as there is no stored JWT token *******/
export const Logout=()=>{
    localStorage.removeItem(tokenname)
    window.location.href="/login"
}


/**** used to check user is authorized are not when accessing protected ruotes, it call IsAuthorizedUrl here we are specified hasAuth=true 
 it will include the JWT token in headers while sending request to the API then the backend server 
 will validate the token and check if user is present with JWT if present it will send success response that means the user is authorized******/
export const authhandler= async ()=>{
    const response = await axiosrequest({
        url:IsAuthorizedUrl,
        hasAuth:true,
        showError:false
    })
    if(response){
        return response.data.Data
    }
    console.log('authfail')
    return null
}


/************This is common code for all API calls, defalut methiod is get method,url is the endpoint which we will hit, 
 payload is the data we are sending when we make a call to the API, errorObject is used to show user custom error messages,
  showError is used to control the notification to be should when success or failure messages are coming from API response.***************/
export const axiosrequest=async({
    method='get',
    url,
    payload,
    hasAuth=false,
    errorObject,
    showError=true
})=>{
    const headers=hasAuth? getAuthToken(): {}
        const response = await instance({method,url,data:payload, headers:{'Content-Type':'text/plain',...headers}}).catch(
            (e)=>{
                if(!showError) return
                notification.error({
                   message: errorObject? errorObject.message: "Operation error",
                   description: errorObject?.description?  errorObject.description:e.message
                })
                console.log(e)
            }
        )
        if(response){
            return response
        }

        return null

}


/********used to call AllJobs API here we recieve list of all available jobs and
  we are displaying this data in student page under available jobs*/
export const getAllAvailableJobs=async(setAllAvailableJobsList, setFetching)=>{
        const response= await axiosrequest({
          url:AllJobs,
          hasAuth:true,
          showError:false
        })
        
        if(response){
            const data=response.data.Data.jobs_list==null?[]:response.data.Data.jobs_list
            console.log(data)
            setAllAvailableJobsList(data)
            setFetching(false)
        }
    }




export const getPostedJobsByRecruiter=async(setPostedJobs,setFetching,username)=>{
        const response= await axiosrequest({
          method:"post",
          url:PostedJobsUrl,
          hasAuth:true,
          showError:false,
          payload:{userName:username}
        })
        
        if(response){
            const data=response.data.Data.posted_jobs_list==null?[]:response.data.Data.posted_jobs_list
            setPostedJobs(data)
            setFetching(false)
        }
    }


export const getappliedApplicants=async(setAppliedApplicants,setFetching,username)=>{
        const response= await axiosrequest({
          method:"post",
          url:AppliedApplicantsUrl,
          hasAuth:true,
          showError:false,
          payload:{uerName:username}
        })
        
        if(response){
            const data=response.data.Data.applied_jobs==null?[]:response.data.Data.applied_jobs
            setAppliedApplicants(data)
            setFetching(false)
        }
    }



export const getAppliedJobs=async(setAppliedJobs,setFetching,username)=>{
        const response= await axiosrequest({
          method:"post",
          url:AppliedJobsUrl,
          hasAuth:true,
          showError:false,
          payload:{userName:username}
        })
        
        if(response){
            const data=response.data.Data.user_jobs==null?[]:response.data.Data.user_jobs
            console.log(data)
            setAppliedJobs(data)
            setFetching(false)
        }
    }