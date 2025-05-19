import { Form, Input, Button, notification } from 'antd'
import Modal from 'antd/es/modal/Modal';
import { useState } from 'react';
import { AddJobUrl } from '../utils/network';
import {axiosrequest} from '../utils/functions'
import TextArea from 'antd/es/input/TextArea';

const AddPostForm=({
    isVisible=false,
    onSucessCallback,
    onClose,
    username
})=> {

    const [loading, setLoading]=useState(false)
    const [form] = Form.useForm();

    

    const onSubmit=async (values)=>{
        console.log(values)
        
        values.posted_by = username
       
        setLoading(true)
        const response = await axiosrequest({
            url:AddJobUrl,
            method:'post',
            hasAuth:true,
            payload:values,
        })
        setLoading(false)
        if(response){
            notification.success({
                    message:"Operation Success",
                    description:"Job added sucessfully"
               })
            onSucessCallback()
            form.resetFields()
        }
        
    }



  return (
    <Modal title="Add Job" 
    open={isVisible} onCancel={onClose} footer={false} maskClosable={false}>
         <Form layout="vertical" onFinish={onSubmit} form={form}>
                <Form.Item label="Posted By"
                    name="posted_by"
                >
                    <Input defaultValue={username} disabled={true} />
                </Form.Item>
                <Form.Item label="Job Title"
                    name="job_title"
                    rules={[{ required: true, message: 'Please input your Job Title!' }]}>
                    <Input placeholder='input job title' type='text'/>
                </Form.Item>
                <Form.Item label="Job Description"
                    name="job_description"
                    rules={[{ required: true, message: 'Please input your Job Description!' }]}>
                    <TextArea rows={4} placeholder='input job description'/>
                </Form.Item>
                <Form.Item label="Experience Required"
                    name="experience_required"
                    rules={[{ required: true, message: 'Please provide Experience Required!' }]}>
                    <Input placeholder='input Experience Required' type='number' min={0}/>
                </Form.Item>
                <Form.Item label="Company Name"
                    name="company_name"
                    rules={[{ required: true, message: 'Please provide company name!' }]}>
                    <Input placeholder='input company name' type='text'/>
                </Form.Item>
                <Form.Item label="Location"
                    name="location"
                    rules={[{ required: true, message: 'Please provide location!' }]}>
                    <Input placeholder='input job location' type='text'/>
                </Form.Item>
                <Form.Item label="Bond Years"
                    name="bond_years"
                    rules={[{ required: true, message: 'Please provide bond years!' }]}>
                    <Input placeholder='input bond years' type='number' min={0}/>
                </Form.Item>
                <Form.Item>
                    <Button type='primary' block htmlType='submit' loading={loading}>Submit</Button>
                </Form.Item>
            </Form>
      </Modal>
  )
}

export default AddPostForm
