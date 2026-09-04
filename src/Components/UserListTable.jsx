import React, { useState, useEffect } from "react";
import { Table, Button, Form, Select } from "antd";
import { BsExclamationCircle } from "react-icons/bs";
import DashboardModal from "./DashboardModal";
import { useUpdateUserMutation } from "../redux/features/Users/usersApi";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { FaCalendarAlt, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUserPlus, FaTimes } from 'react-icons/fa';

const { Option } = Select;

const UserListTable = ({ role = "user", data = [], pagination, setCurrentPage = () => { } }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [form] = Form.useForm();

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const showModal = (record) => {
    setModalData(record);
    setIsModalOpen(true);
  };

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

  const onFinish = async (status) => {
    try {
      const userId = modalData._id;
      await updateUser({ id: userId, payload: {status} }).unwrap();
      toast.success("User updated successfully.");
      setIsModalOpen(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed!!",
        text: error.message || error?.data?.message || "Something went wrong.",
      });
    }
  };

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
        <Button onClick={() => showModal(record)} type="text" shape="circle">
          <BsExclamationCircle className="text-hash" size={20} />
        </Button>
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

      <DashboardModal setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen}>
        <div className="">
          {/* Header with close button */}
          <div className="relative p-6 pb-4">
            {/* Profile Image */}
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                <img
                  src={ `${import.meta.env.VITE_IMAGE_URL}/` + modalData?.profileImage }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Name and Title */}
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800">{modalData.name}</h2>
              <p className="text-gray-600 text-sm mt-1">User Profile</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="px-6 pb-6">
            <div className="space-y-4">
              {/* Date of Birth */}
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <FaCalendarAlt className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Date of Birth</p>
                  <p className="text-sm text-gray-600">{modalData.dateOfBirth || 'N/A'}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <FaEnvelope className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Email</p>
                  <p className="text-sm text-gray-600">{modalData.email || 'N/A'}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <FaPhone className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Phone</p>
                  <p className="text-sm text-gray-600">{modalData.phone || 'N/A'}</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <FaMapMarkerAlt className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Address</p>
                  <p className="text-sm text-gray-600">{modalData.address || 'N/A'}</p>
                </div>
              </div>

              {/* Signup Date */}
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <FaUserPlus className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Signup Date</p>
                  <p className="text-sm text-gray-600">{modalData?.createdAt ? new Date(modalData.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Suspend Button */}
          <div className="px-6 pb-6">
            <button
              className={`w-full ${modalData.status === 'active' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                } text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200`}
              onClick={() => onFinish(modalData.status === 'active' ? 'inactive' : 'active')}
            >
              {modalData.status === 'active' ? 'Suspend' : 'Activate'}
            </button>
          </div>
        </div>
      </DashboardModal>
    </div>
  );
};

export default UserListTable;
