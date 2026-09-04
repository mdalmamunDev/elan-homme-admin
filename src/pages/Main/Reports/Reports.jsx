import React, { useState, useEffect } from "react";
import { Button, Form, Input, InputNumber, Table } from "antd";
import { IoSearch } from "react-icons/io5";

import PageHeading from "../../../Components/PageHeading";

import {
  useDeleteReportMutation,
  useGetAllReportsQuery,
  useStoreReportMutation,
  useUpdateReportMutation,
} from "../../../redux/features/reports/reportsApi";
import DashboardModal from "../../../Components/DashboardModal";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import LoaderWraperComp from "../../../Components/LoaderWraperComp";
import { BsExclamationCircle } from "react-icons/bs";
import { useUpdateUserMutation } from "../../../redux/features/Users/usersApi";

const Reports = () => {
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();

  const [searchQuery, setSearchQuery] = useState({
    keyword: "",
    limit: 10,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});

  const [storeReport] = useStoreReportMutation();
  const [updateReport] = useUpdateReportMutation();
  const [deleteReport] = useDeleteReportMutation();
  
  const [updateUser] = useUpdateUserMutation();
  const updateUserStatus = async (userId, newStatus) => {
    try {
      await updateUser({ id: userId, payload: { status: newStatus } }).unwrap();
      toast.success("User updated successfully.");

      // Reflect the change in modalData state
      setModalData((prevData) => {
        const isReporter = prevData?.userId?._id === userId;
        const isReported = prevData?.providerId?._id === userId;

        const updatedData = { ...prevData };

        if (isReporter) {
          updatedData.userId = {
            ...updatedData.userId,
            status: newStatus,
          };
        }

        if (isReported) {
          updatedData.providerId = {
            ...updatedData.providerId,
            status: newStatus,
          };
        }

        return updatedData;
      });
      refetch();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed!!",
        text: error.message || error?.data?.message || "Something went wrong.",
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this report?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteReport({ id });
      toast.success("Report deleted successfully.");
      setCurrentPage(1);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed!!",
        text:
          (error.message || error?.data?.message || "Something went wrong.") +
          " Please try again later.",
      });
    }
  };


  // Fetch reports using searchQuery and currentPage
  const { data: response, isLoading, isError, refetch } = useGetAllReportsQuery({
    page: currentPage,
    ...searchQuery,
  });

  const reports = response?.data || [];
  const pagination = response?.pagination || {};

  const columns = [
    {
      title: "Reported",
      dataIndex: ["providerId", "name"],
      key: "name",
      render: (name, record) => (
        <div className="flex">
          <div
            title={record.status}
            className={`w-2 h-6 me-2 rounded-md ${record.status === "pending"
              ? "bg-yellow-500"
              : record.status === "solved"
                ? "bg-green-500"
                : "bg-red-500"
              }`}
          ></div>
          {name || "N/A"}
        </div>
      ),
    },
    {
      title: "Reporter",
      dataIndex: ["userId", "name"],
      key: "name",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      render: (reason) => {
        if (!reason) return "N/A";
        return reason.length > 80 ? reason.slice(0, 80) + "..." : reason;
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => new Date(createdAt).toLocaleString() || "N/A",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div className="flex gap-x-4 items-center">
          <Button onClick={() => showModal(record)} type="text" shape="circle">
            <BsExclamationCircle className="text-hash" size={20} />
          </Button>
          <FaTrash
            size={20}
            className="cursor-pointer text-red-600"
            title="Delete"
            onClick={() => handleDelete(record._id)}
          />
        </div>
      ),
    },
  ];

  // When searchQuery changes, reset page to 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const onSearchFinish = (values) => {
    setSearchQuery({
      keyword: values.keyword || "",
      limit: values.limit || 10,
    });
  };

  const showModal = (record = {}) => {
    setModalData(record);
    setIsModalOpen(true);
    modalForm.setFieldsValue({
      name: record.name || "",
      baseFare: record.baseFare ?? 0,
      perKM: record.perKM ?? 0,
      charge: record.charge ?? 0,
    });
  };



  return (
    <div className="py-[16px]">
      <LoaderWraperComp isError={isError} isLoading={isLoading}>
        <div className="flex gap-2 bg-4">
          <div className="p-2 flex-1 flex justify-between items-center">
            <PageHeading title={"Reports"} disbaledBackBtn={true} />

            <Form
              form={form}
              layout="inline"
              initialValues={{ keyword: "", limit: 10 }}
              onFinish={onSearchFinish}
              className="items-center space-x-2"
            >
              <Form.Item name="limit" className="mb-0">
                <InputNumber
                  min={5}
                  max={1000}
                  step={5}
                  placeholder="Limit"
                  className="w-[90px]"
                />
              </Form.Item>

              <Form.Item name="keyword" className="mb-0">
                <Input
                  placeholder="Report"
                  className="focus:outline-none outline-none placeholder:text-[#222222] px-3.5 text-sm w-[170px]"
                  allowClear
                  onPressEnter={() => form.submit()}
                />
              </Form.Item>

              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-s-1 ms-1"
                  shape="circle"
                  icon={<IoSearch />}
                />
              </Form.Item>
            </Form>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={reports}
          rowKey={(record) => record._id}
          pagination={{
            current: pagination.currentPage || currentPage,
            pageSize: pagination.itemsPerPage || searchQuery.limit,
            total: pagination.totalCount || 0,
            showSizeChanger: false,
            position: ["bottomCenter"],
            onChange: (page) => setCurrentPage(page),
          }}
          loading={isLoading}
          className="mt-6"
        />

        <DashboardModal setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} width="900px" maxWidth="90%">
          <div className="text-base space-y-6">
            <h6 className="font-semibold text-2xl text-center text-gray-800">Report Details</h6>

            {/* User Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Reported User Card */}
              <div className={`flex items-center justify-between p-4 rounded-xl shadow border ${modalData?.providerId?.status === 'inactive' ? 'bg-red-100' : ''}`}>
                <div className="flex items-center gap-4">
                  <img
                    src={ `${import.meta.env.VITE_IMAGE_URL}/` + modalData?.providerId?.profileImage }
                    alt="Reported Avatar"
                    className="w-14 h-14 rounded-full object-cover border"
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      {modalData?.providerId?.name || "Unknown"}
                    </h4>
                    <p className="text-sm text-gray-600">{modalData?.providerId?.email || "N/A"}</p>
                    <span className="text-xs text-gray-400">Reported User</span>
                  </div>
                </div>

                <Button
                  type="primary"
                  className={modalData?.providerId?.status === 'inactive' ? 'bg-green-600' : 'bg-red-600'}
                  onClick={() => updateUserStatus(modalData?.providerId?._id, modalData?.providerId?.status === 'inactive' ? 'active' : 'inactive')}
                >
                  {modalData?.providerId?.status === 'inactive' ? 'Activate' : 'Suspend'}
                </Button>
              </div>
              {/* Reporter Card */}
              <div className={`flex items-center justify-between p-4 rounded-xl shadow border ${modalData?.userId?.status === 'inactive' ? 'bg-red-100' : ''}`}>
                <div className="flex items-center gap-4">
                  <img
                    src={ `${import.meta.env.VITE_IMAGE_URL}/` + modalData?.userId?.profileImage }
                    alt="Reporter Avatar"
                    className="w-14 h-14 rounded-full object-cover border"
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      {modalData?.userId?.name || "Unknown"}
                    </h4>
                    <p className="text-sm text-gray-600">{modalData?.userId?.email || "N/A"}</p>
                    <span className="text-xs text-gray-400">Reporter</span>
                  </div>
                </div>

                <Button
                  type="primary"
                  className={modalData?.userId?.status === 'inactive' ? 'bg-green-600' : 'bg-red-600'}
                  onClick={() => updateUserStatus(modalData?.userId?._id, modalData?.userId?.status === 'inactive' ? 'active' : 'inactive')}
                >
                  {modalData?.userId?.status === 'inactive' ? 'Activate' : 'Suspend'}
                </Button>
              </div>
            </div>

            {/* Report Info Section */}
            <div className="bg-gray-50 p-5 rounded-lg border shadow-sm">
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-600 mb-1">Reason</p>
                <p className="text-gray-800 bg-white p-3 rounded-md border text-sm leading-relaxed">
                  {modalData?.reason || "No reason provided."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full text-white text-xs capitalize ${modalData?.status === "pending"
                        ? "bg-yellow-500"
                        : modalData?.status === "solved"
                          ? "bg-green-600"
                          : "bg-red-500"
                      }`}
                  >
                    {modalData?.status || "Unknown"}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600">Created At</p>
                  <p className="text-sm text-gray-700 mt-1">
                    {new Date(modalData?.createdAt).toLocaleString() || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between gap-3 pt-4">
              <Button type="default" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
              <div>
                <span>Mark as: </span>
                <Button
                  type="primary"
                  className="bg-red-600 me-2"
                  onClick={() =>
                    updateReport({ id: modalData._id, payload: { status: "ignored" } })
                      .then(() => {
                        toast.success("Marked as ignored");
                        setIsModalOpen(false);
                      })
                      .catch(() => toast.error("Failed to update status"))
                  }
                >
                  Ignored
                </Button>
                <Button
                  type="primary"
                  className="bg-green-600"
                  onClick={() =>
                    updateReport({ id: modalData._id, payload: { status: "solved" } })
                      .then(() => {
                        toast.success("Marked as solved");
                        setIsModalOpen(false);
                      })
                      .catch(() => toast.error("Failed to update status"))
                  }
                >
                  Solved
                </Button>
              </div>
            </div>
          </div>
        </DashboardModal>

      </LoaderWraperComp>
    </div>
  );
};

export default Reports;
