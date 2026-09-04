import React, { useState } from "react";
import { Table, Button, Spin } from "antd";
import { BsExclamationCircle } from "react-icons/bs";
import { GrDocumentDownload } from "react-icons/gr";
import notFound from "../assets/images/guest-status.png";
import { sweetAlertConfirmation } from "../utils/helpers/alert";
import DashboardModal from "./DashboardModal";
import { useGetAllUserQuery, useManagerApproveDenyMutation } from "../redux/features/Users/usersApi";

const UserTable = ({ role = "manager", queryParams, page = 1, requestStatus, pagination = true }) => {
  // Helper function to map raw managerInfo.type to a cleaner business type
  const getBusinessType = (type) => {
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
  };

  // Fetch dynamic data from the API using dynamic query parameters
  const { data: usersData, isLoading, isError } = useGetAllUserQuery(queryParams);

  // Assuming your API returns an object with a `data` property that is an array
  const usersList = usersData?.data || [];
  // If more than five records are returned, only show the first five
  const data = usersList.slice(0, 5);
  console.log(data);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});

  // Setup the managerApproveDeny mutation
  const [managerApproveDeny] = useManagerApproveDenyMutation();

  const showModal = (data) => {
    setIsModalOpen(true);
    setModalData(data);
  };

  // Updated handleRequest to call the managerApproveDeny mutation
  const handleRequest = (id, status) => {
    managerApproveDeny({ id, status })
      .unwrap()
      .then((res) => {
        console.log("Manager approval/deny success:", res);
        // Optionally, trigger a refetch or show a success message here
      })
      .catch((err) => {
        console.error("Error in manager approval/deny:", err);
      });
  };

  const columns = [
    {
      title: "User ID",
      render: (text, _record, index) => <p>records</p>,
    },
    {
      title: <span className="capitalize">{role} Name</span>,
      render: (data) => (
        <div className="flex gap-2 items-center">
          <div className="w-10 h-10 overflow-hidden rounded-full">
            <img
              src={
                data.image
                  ? `${import.meta.env.VITE_IMAGE_URL}${data.image}`
                  : notFound
              }
              alt="profile"
              className="rounded-full w-full h-full object-cover"
            />
          </div>
          <p className="text-sm">{data.name}</p>
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
      key: "phone",
      dataIndex: "phone",
    },
    {
      title: "Date",
      key: "date",
      dataIndex: "createdAt",
      render: (text) => new Date(text).toLocaleDateString("en-GB"),
    },
    {
      title: "Details",
      key: "Details",
      render: (data) => (
        <Button onClick={() => showModal(data)} type="text" shape="circle">
          <BsExclamationCircle className="text-hash" size={20} />
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Spin size="large" />
      </div>
    );
  }
  if (isError) {
    return <p>Error loading data.</p>;
  }

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
            pageSize: 5,
          }
        }
      />
      <DashboardModal setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen}>
        <div className="flex flex-col justify-between text-base">
          <div className="space-y-7">
            <h6 className="font-medium text-center text-xl pb-1">Account Details</h6>
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
          {/* You can add action buttons here if needed */}
        </div>
      </DashboardModal>
    </div>
  );
};

export default UserTable;




