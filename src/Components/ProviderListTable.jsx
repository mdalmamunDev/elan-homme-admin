import { useState, useEffect } from "react";
import { Table, Form, Select } from "antd";
import { BsExclamationCircle } from "react-icons/bs";
import { Link } from "react-router-dom";

const ProviderListTable = ({ data = [], pagination, setCurrentPage = () => { } }) => {
  const [modalData, setModalData] = useState({});
  const [form] = Form.useForm();



  // When modalData changes, reset and populate form fields
  useEffect(() => {
    if (modalData && Object.keys(modalData).length > 0) {
      form.setFieldsValue({
        role: modalData.role || "",
        status: modalData.status || "",
      });
    } else {
      form.resetFields();
    }
  }, [modalData, form]);


  const columns = [
    {
      title: "User ID",
      key: "_id",
      render: (record) => (
        <div className="flex">
          <div
            title={record.status}
            className={`w-2 h-6 me-2 rounded-md ${record.status === "active"
              ? "bg-green-500"
              : record.status === "delete"
                ? "bg-black"
                : "bg-red-500"
              }`}
          ></div>
          {record._id || "N/A"}
        </div>
      ),
    },
    {
      title: <span className="capitalize">Name</span>,
      dataIndex: "name",
      key: "name",
      render: (text) => text || "N/A",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => text || "N/A",
    },
    {
      title: "Phone Number",
      key: "phone",
      dataIndex: "phone",
      render: (text) => text || "N/A",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (text) => text || "N/A",
    },
    {
      title: "Join Date",
      key: "date",
      dataIndex: "createdAt",
      render: (text) => (text ? new Date(text).toLocaleDateString("en-GB") : "N/A"),
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <Link to={`/provider-details?id=${record?._id}`} type="text" shape="circle">
          <BsExclamationCircle className="text-hash" size={20} />
        </Link>
      ),
    },
  ];


  return (
    <div className="py-[20px]">
      <Table
        loading={false}
        columns={columns}
        dataSource={data.map((item, index) => ({
          ...item,
          key: index + 1,
        }))}
        pagination={
          pagination && {
            position: ["bottomCenter"],
            showQuickJumper: true,
            showSizeChanger: false,
            total: pagination.totalCount,
            current: pagination.currentPage,
            pageSize: pagination.itemsPerPage,
            onChange: (page) => setCurrentPage(page),
          }
        }
      />
    </div>
  );
};

export default ProviderListTable;
