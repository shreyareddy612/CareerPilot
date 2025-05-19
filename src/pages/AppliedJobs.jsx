import {  useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useGetAppliedJobs} from '../utils/hooks';
import { Card} from "antd"
import { store } from '../utils/store'
import PdfViewerButton from './PdfViewer';
import { Loading } from '../components/Loading';



export default function AppliedJobs() {

  const {state:{user}}=useContext(store)
  const role=user?.role? user.role:""
  const username=user?.userName? user.userName:""

  const [fetching, setFetching]=useState(true)
  const [appliedJobs,setAppliedJobs]=useState([])

  const navigate=useNavigate()

  useEffect(()=>{
        if(role!=="Student"){
            console.log("not student")
            navigate("/recruiter")
        }
  },[role, navigate]);

  useGetAppliedJobs(setAppliedJobs,setFetching,username)
  


    return (
        <>{role!=="Student"?<Loading/>:
        <div className='card'>
                <div className='cardheader'>
                    <div className='headerContent' style={{fontWeight:'bolder', fontSize:'20px'}}>Applied Jobs</div>
                    <div className='rightContent'>
                        <Link to="/student" style={{ textDecoration: 'none', color:'black' }}>Available Jobs</Link>
                    </div>
                </div>
                <br/>
                {appliedJobs.length===0?<></>: appliedJobs.map(job=>
                    <Card 
                      hoverable
                      title={<h2>{job.job_title}</h2>}
                      extra={<PdfViewerButton resumeurl={job.resume}/>} style={{ marginTop: 16 }} loading={fetching}>
                        <p style={{fontWeight:'bold'}}>Company: <span style={{fontWeight:'500'}}>{job.company_name}</span></p>
                        <p style={{fontWeight:'bold'}}>Posted By: <span style={{fontWeight:'500'}}>{job.posted_by}</span></p>
                    </Card>
                )}
            </div>}
            </>
        
    )
}
