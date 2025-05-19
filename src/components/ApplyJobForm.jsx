import { Form, Input, Button, notification } from "antd";
import Modal from "antd/es/modal/Modal";
import { useRef, useState } from "react";
import { ApplyJobUrl, CloudinaryUrl } from "../utils/network";
import { axiosrequest } from "../utils/functions";
import resumeimage from "../assets/icons8-file-upload-64.png";
import success from "../assets/c7c7f049-f42c-4a40-b0e7-63eb70b93e58.svg";

const ApplyJobForm = ({
  isVisible = false,
  onSucessCallback,
  onClose,
  jobDetails,
  username,
}) => {
  const [loading, setLoading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState(null);

  const fileSelect = useRef(null);

  const [form] = Form.useForm();

  const onSubmit = async (values) => {
    console.log(values);
    if (resumeUrl) {
      values = {
        ...values,
        resume: resumeUrl,
        company_name: jobDetails.Company,
        job_title: jobDetails.JobTitle,
        userName: username,
        posted_by: jobDetails.PostedBy,
      };
    }
    setLoading(true);
    const response = await axiosrequest({
      url: ApplyJobUrl,
      method: "post",
      hasAuth: true,
      payload: values,
    });
    setLoading(false);
    if (response) {
      notification.success({
        message: "Operation Success",
        description: "Job Applied sucessfully",
      });
      onSucessCallback();
      form.resetFields();
      setResumeUrl(null);
    }
  };

  const handleFileChange = async (e) => {
    const formItem = new FormData();
    formItem.append("file", e.target.files[0]);
    formItem.append("upload_preset", "inventory_app");
    formItem.append("tags", "inventory_app");
    setLoading(true);
    const response = await axiosrequest({
      url: CloudinaryUrl,
      method: "post",
      payload: formItem,
    });
    setLoading(false);
    if (response) {
      setResumeUrl(response.data.url);
    }
  };

  return (
    <Modal
      title="Apply Job"
      open={isVisible}
      onCancel={onClose}
      footer={false}
      maskClosable={false}
    >
      <Form layout="vertical" onFinish={onSubmit} form={form}>
        <Form.Item label="Username" name="userName">
          <Input defaultValue={username} disabled={true} />
        </Form.Item>
        <Form.Item label="Company" name="company_name">
          <Input defaultValue={jobDetails.Company} disabled={true} />
        </Form.Item>
        <Form.Item label="Job Title" name="job_title">
          <Input defaultValue={jobDetails.JobTitle} disabled={true} />
        </Form.Item>
        <Form.Item label="Posted By" name="posted_by">
          <Input defaultValue={jobDetails.PostedBy} disabled={true} />
        </Form.Item>
        <Form.Item>
          <Form.Item label="Resume">
            <div
              className="imageView"
              onClick={() => !loading && fileSelect.current?.click()}
              style={{
                backgroundImage: `url(${resumeUrl ? success : resumeimage})`,
              }}
            />
            <input
              type="file"
              style={{ display: "none" }}
              ref={fileSelect}
              onChange={handleFileChange}
            />
          </Form.Item>
          <Button
            style={{ background: "#174EA6" }}
            type="primary"
            block
            htmlType="submit"
            loading={loading}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ApplyJobForm;
