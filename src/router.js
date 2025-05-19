import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { AuthRoute } from './components/AuthRoute'
import CheckUser from './pages/SignUp'
import Login from './pages/Login'
import CompanyHomePage from './pages/CompanyHomePage'
import Student from './pages/Student'
import Recruiter from './pages/Recruiter'
import AppliedApplicants from './pages/AppliedApplicants'
import AppliedJobs from './pages/AppliedJobs'
import Layout from './components/Layout'

const Router=()=>{
    return (
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<CompanyHomePage/>}/>
        <Route path="/login" element={<Login/>} />
        <Route path='/signUp' element={<CheckUser/>}/>
        <Route path='/layout' element={<Layout/>}/>
        <Route path="/" element={<AuthRoute/>}>
            <Route path="/appliedApplicants" element={<AppliedApplicants/>}/>
            <Route path="/recruiter" element={<Recruiter/>}/>
            <Route path="/student" element={<Student/>}/>
            <Route path="/appliedJobs" element={<AppliedJobs/>}/>
        </Route>
    </Routes>
    </BrowserRouter>)
}

export default Router