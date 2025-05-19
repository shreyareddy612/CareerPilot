import {  useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { Card } from "antd"
import { store } from '../utils/store'
import PdfViewerButton from './PdfViewer';
import { useGetAppliedApplicants } from '../utils/hooks';
import { Loading } from '../components/Loading';

export default function AppliedApplicants() {

  const {state:{user}}=useContext(store)
  const role=user?.role? user.role:""
  const username=user?.userName? user.userName:""

  const [fetching, setFetching]=useState(true)
  const [appliedApplicants,setAppliedApplicants]=useState([])

  const navigate=useNavigate()

  
  useEffect(()=>{
        if(role!=="Recruiter"){
            console.log("not Recruiter")
            navigate("/student")
            
        }
  },[])

  useGetAppliedApplicants(setAppliedApplicants,setFetching,username)

  

    return (
        <>{role!=="Recruiter"?<Loading/>:
        <div className='card'>
                <div className='cardheader'>
                    <div className='headerContent' style={{fontWeight:'bolder', fontSize:'20px'}}>Applied Applicants</div>
                    <div className='rightContent'>
                        <Link to="/recruiter" style={{ textDecoration: 'none', color:'black' }}> Add Post </Link>
                    </div>
                </div>
                <br/>
                {appliedApplicants.map(job=>
                    <Card hoverable title={<h2>Postion: <span>{job.job_title}</span></h2>} extra={<PdfViewerButton resumeurl={job.resume}/>} style={{ marginTop: 16}} loading={fetching}>
                            <p style={{ fontWeight:'bold'}}>Name: <span style={{ fontWeight:'450'}}>{job.first_name+" "+job.last_name}</span></p>
                            <p style={{ fontWeight:'bold'}}>Email: <span style={{ fontWeight:'450'}}>{job.email}</span></p>
                            <p style={{ fontWeight:'bold'}}>Contact: <span style={{ fontWeight:'450'}}>{job.phone_number}</span></p>
                    </Card>
                )}
            </div>}
        </>
        
    )
}
