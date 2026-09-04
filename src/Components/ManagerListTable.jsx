import React, { useState } from "react";
import { Table, Button } from "antd";
import { BsExclamationCircle } from "react-icons/bs";
import { GrDocumentDownload } from "react-icons/gr";
import notFound from "../assets/images/guest-status.png";
import { sweetAlertConfirmation } from "../utils/helpers/alert";
import DashboardModal from "./DashboardModal";
import { useManagerApproveDenyMutation } from "../redux/features/Users/usersApi";

// Helper function to map managerInfo.type to a friendly business type
function getBusinessType(type) {
  const mapping = {
    "Are you a manager for a restaurant?": "restaurant",
    "Are you a manager for a bars?": "bars",
    "Are you a manager for a nightclubs?": "night-clubs",
    "Are you a manager for a party restaurant?": "restaurant",
    "Are you a manager for  ticketed parties?": "ticketed parties",
    "Are you a manager for a comedy club?": "comedy club",
    "Are you a manager for concerts?": "concerts",
  };
  return mapping[type] || type;
}

const ManagerListTable = ({
  role = "manager",
  data = [],
  pageSize = 10,
  pagination = true,
  managerStatus,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});

  const [managerApproveDeny] = useManagerApproveDenyMutation();

  const showModal = (record) => {
    setModalData(record);
    setIsModalOpen(true);
  };

  const handleRequest = (id, status) => {
    managerApproveDeny({ id, status })
      .unwrap()
      .then((res) => {
        console.log("Manager approval/deny success:", res);
      })
      .catch((err) => {
        console.error("Error in manager approval/deny:", err);
      });
  };

  // Dynamic Request column:
  // - In the All Managers view (managerStatus !== "send"), we simply show "Approved"
  // - In the Pending Managers view (managerStatus === "send"), we show both Approve and Deny buttons.
  const dynamicField = [
    {
      title: "Request",
      key: "request",
      render: (record) => {
        if (managerStatus === "approve") {
          return <span className="text-green-600 font-medium">Approved</span>;
        }
        if (managerStatus === "send") {
          return (
            <div className="flex justify-center gap-3">
              <button
                onClick={() =>
                  sweetAlertConfirmation({
                    func: () => handleRequest(record._id, "approve"),
                    object: "Approve",
                    conColor: "#34D399",
                  })
                }
                className="text-[13px] font-medium text-white py-1.5 px-3 shadow-current bg-[#34D399] rounded-xl"
              >
                Approve
              </button>
              <button
                onClick={() =>
                  sweetAlertConfirmation({
                    func: () => handleRequest(record._id, "deny"),
                    object: "Deny",
                  })
                }
                className="text-[13px] font-medium text-white py-1.5 px-4 shadow-current bg-red-400 rounded-xl"
              >
                Deny
              </button>
            </div>
          );
        }
      },
      align: "center",
    },
  ];

  const columns = [
    {
      title: "#SI",
      render: (text, record, index) => (
        <p>
          {managerStatus === "send"
            ? index + 1
            : (currentPage - 1) * pageSize + index + 1}
        </p>
      ),
    },
    {
      title: <span className="capitalize">{role} Name</span>,
      render: (record) => (
        <div className="flex gap-2 items-center">
          <div className="w-10 h-10 overflow-hidden rounded-full">
            <img
              src={
                record.image
                  ? `${import.meta.env.VITE_IMAGE_URL}${record.image}`
                  : notFound
              }
              alt="profile"
              className="rounded-full w-full h-full object-cover"
            />
          </div>
          <p className="text-sm">{record.name}</p>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "date",
      render: (text) => new Date(text).toLocaleDateString("en-GB"),
    },
    ...dynamicField,
    {
      title: "Details",
      key: "details",
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
            total: data.length,
            defaultCurrent: 1,
            pageSize: pageSize,
            onChange: (page) => setCurrentPage(page),
          }
        }
      />
      <DashboardModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <div className="flex flex-col justify-between text-base">
          <div className="space-y-7">
            <h6 className="font-medium text-center text-xl pb-1">
              Account Details
            </h6>
            <div className="flex justify-between">
              <p className="text-hash">Full Name</p>
              <p>{modalData.name}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-hash">Email</p>
              <p>{modalData.email}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-hash">Phone Number</p>
              <p>{modalData.phone}</p>
            </div>
            {modalData.role === "manager" && modalData.managerInfo ? (
              <>
                <div className="flex justify-between">
                  <p className="text-hash">Business Type</p>
                  <p>{getBusinessType(modalData.managerInfo.type)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-hash">Business Address</p>
                  <p>{modalData.managerInfo.businessAddress || "N/A"}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-hash">Website URL</p>
                  <a
                    href={modalData.managerInfo.websiteLink || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {modalData.managerInfo.websiteLink || "N/A"}
                  </a>
                </div>
                <div className="flex justify-between">
                  <p className="text-hash">Business License Document</p>
                  {modalData.managerInfo.governMentImage ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded">
                        <img
                          src={`${import.meta.env.VITE_IMAGE_URL}${modalData.managerInfo.governMentImage}`}
                          alt="License Document Preview"
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <a
                        href={`${import.meta.env.VITE_IMAGE_URL}${modalData.managerInfo.governMentImage}`}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <GrDocumentDownload className="text-hash" size={24} />
                      </a>
                    </div>
                  ) : (
                    <span>N/A</span>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <p className="text-hash">Subscription Type</p>
                  <p>{modalData.subscription || "Monthly"}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-hash">Address</p>
                  <p>{modalData.address || "N/A"}</p>
                </div>
              </>
            )}
            <div className="flex justify-between mb-5">
              <p className="text-hash">Join Date:</p>
              <p>{new Date(modalData.createdAt).toLocaleDateString("en-GB")}</p>
            </div>
          </div>
        </div>
      </DashboardModal>
    </div>
  );
};

export default ManagerListTable;
