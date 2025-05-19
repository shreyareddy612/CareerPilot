import { Space, Spin } from "antd";


export const Loading=()=>{
  return (
    <Space direction="vertical" style={{ width: '100%', alignItems:"center", justifyContent:"space-around", height:"100vh"}}>
    <Space>
      <Spin tip="Loading" size="large">
      </Spin>
    </Space>
    </Space>
  )
}
