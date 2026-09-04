import React, { useState, useEffect } from "react";

import LoaderComponent from "../../../Components/LoaderWraperComp";
import { Button, Input, InputNumber, Table, Form, Select } from "antd";
import { IoSearch } from "react-icons/io5";
import PageHeading from "../../../Components/PageHeading";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useGetWithdrawQuery, useResponseWithdrawMutation } from "../../../redux/features/payments/withdrawApi";
import LoaderWraperComp from "../../../Components/LoaderWraperComp";

import appBalanceIcon from "../../../assets/images/icon-app-balance.svg"
import earningsIcon from "../../../assets/images/icon-transactions.svg"
import withdrawalIcon from "../../../assets/images/icon-withdrawal.svg"

const Withdraw = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState({
    keyword: "",
    limit: 10,
    status: "",
  });

  const limit = Number(searchQuery.limit) || 15;

  const { data: response, isLoading, isError } = useGetWithdrawQuery({
    page: currentPage,
    ...searchQuery,
  });

  const [responseWithdraw] = useResponseWithdrawMutation();

  // AntD Form instance
  const [form] = Form.useForm();

  // When searchQuery changes, reset page to 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // On form submit
  const onFinish = (values) => {
    setSearchQuery({
      keyword: values.keyword?.trim() || "",
      limit: values.limit || 10,
      status: values.status,
    });
  };

  const handleWithdrawRes = async (id, status) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `This withdraw will be ${status} permanently.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, do it!",
    });
    if (!result.isConfirmed) return;
    try {
      await responseWithdraw({ id, status }).unwrap();
      Swal.fire(status.toUpperCase(), `Item ${status} successfully.`, "success");
    } catch (error) {
      Swal.fire("Something went wrong!", error?.data?.message || "Please try again.");
    }
  };

  const columns = [
    {
      title: "UserID",
      dataIndex: ["userId", "id"],
      key: "userID",
      render: (text, record) => (
        <div className="flex items-center">
          <div
            title={record.status || "Unknown status"}
            className={`w-2 h-6 me-2 rounded-md ${record.status === "success"
              ? "bg-green-500"
              : record.status === "pending"
                ? "bg-yellow-500"
                : "bg-red-500"
              }`}
          />
          {text || "N/A"}
        </div>
      ),
    },
    {
      title: "User Name",
      dataIndex: ["userId", "name"],
      key: "userName",
      render: (text) => text || "N/A",
    },
    {
      title: "Email",
      dataIndex: ["userId", "email"],
      key: "email",
      render: (text) => text || "N/A",
    },
    {
      title: "Req. Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => (text ? new Date(text).toLocaleDateString("en-GB") : "N/A"),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text) => <span>${isNaN(Number(text)) ? "0.00" : Number(text).toFixed(2)}</span>,
    },
    {
      title: "Charge",
      dataIndex: "charge",
      key: "charge",
      render: (text) => <span>${isNaN(Number(text)) ? "0.00" : Number(text).toFixed(2)}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <>
          <Button
            // type="primary"
            className="bg-green-600 text-white w-14 py-1 rounded-md mr-1 transition-shadow shadow-sm hover:shadow-md"
            onClick={() => handleWithdrawRes(record._id, "success")}
            aria-label="Approve"
            disabled={record.status !== "pending"}
          >
            Pay
          </Button>
          <Button
            // type="primary"
            // danger
            className="bg-red-600 text-white w-14 py-1 rounded-md mr-1 transition-shadow shadow-sm hover:shadow-md"
            onClick={() => handleWithdrawRes(record._id, "canceled")}
            aria-label="Reject"
            disabled={record.status !== "pending"}
          >
            Reject
          </Button>
        </>
      ),
    },
  ];

  const appBalance = response?.data?.appBalance ?? 0;
  const totalWithdrawal = response?.data?.totalWithdrawal ?? 0;
  const totalEarnings = response?.data?.totalEarnings ?? 0;
  const payments = response?.data?.payments ?? [];

  const homeStatus = [
      {
        title: "App Balance",
        amount: appBalance?.toFixed(2),
        icon: appBalanceIcon,
        gradient: "from-[#d5f7f7] to-[#91e3fa]",
      },
      {
        title: "Total Earnings",
        amount: totalEarnings?.toFixed(2),
        icon: earningsIcon,
        gradient: "from-[#f7f4ef] to-[#ddcfb4]",
      },
      {
        title: "Total Withdrawal",
        amount: totalWithdrawal?.toFixed(2),
        icon: withdrawalIcon,
        gradient: "from-green-100 to-green-300",
      },
    ];

  return (
    <div className="py-[16px]">

      <LoaderWraperComp isError={isError} isLoading={isLoading}>
        {/* Page heading and filters form */}
        <div className="p-2 flex justify-between items-center bg-4">
          <PageHeading title={"Withdraw"} disbaledBackBtn={true} />

          <Form
            form={form}
            layout="inline"
            className="flex items-center gap-x-2"
            initialValues={searchQuery}
            onFinish={onFinish}
          >
            <Form.Item
              name="limit"
              rules={[
                {
                  type: "number",
                  min: 5,
                  max: 1000,
                  transform: (value) => Number(value),
                },
              ]}
            >
              <InputNumber
                min={5}
                max={1000}
                step={5}
                placeholder="Limit"
                className="w-[90px]"
              />
            </Form.Item>
            
            <Form.Item name="status" noStyle>
              <Select placeholder="Status" style={{ width: 140 }}>
                <Option value="">Select Status</Option>
                <Option value="pending">Pending</Option>
                <Option value="success">Success</Option>
                <Option value="canceled">Failed</Option>
              </Select>
            </Form.Item>

            <Form.Item name="keyword" noStyle>
              <Input
                placeholder="User Name/Email/ID/Phone"
                className="focus:outline-none outline-none placeholder:text-[#222222] px-3.5 text-sm w-[170px] ms-3"
                allowClear
              />
            </Form.Item>

            <Form.Item noStyle>
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

        <div className="flex justify-evenly gap-1 mt-5">
          {homeStatus.map((item, inx) => (
            <div
              key={inx}
              className={`grid grid-cols-4 gap-2 items-center rounded-2xl border border-[#5366FF33] bg-gradient-to-r ${item.gradient} w-full py-6 px-8 cursor-default`}
            >
              <div className="col-span-1">
                <img src={item.icon} alt="" />
              </div>
              <div className="col-span-3">
                <h3 className="text-3xl font-bold">{item.amount}</h3>
                <h3 className="text-md font-medium">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="py-[20px]">
          <Table
            loading={isLoading}
            columns={columns}
            dataSource={payments.map((item, index) => ({
              ...item,
              key: index + 1,
            }))}
            pagination={{
              position: ["bottomCenter"],
              showQuickJumper: true,
              showSizeChanger: false,
              current: currentPage,
              pageSize: limit,
              total: response?.pagination?.totalCount || 0,
              onChange: (page) => setCurrentPage(page),
            }}
          />
        </div>
      </LoaderWraperComp>
    </div>
  );
};

export default Withdraw;
