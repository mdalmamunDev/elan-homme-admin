import React, { useState, useEffect } from "react";
import LoaderWraperComp from "../../../Components/LoaderWraperComp";
import { Button, Input, InputNumber, Table, Form, Select } from "antd";
import { IoSearch } from "react-icons/io5";
import PageHeading from "../../../Components/PageHeading";
import { useGetTransferAllQuery, useTransferTransactionMutation } from "../../../redux/features/payments/transactionApi";
import { useNavigate } from "react-router-dom";
import appBalanceIcon from "../../../assets/images/icon-app-balance.svg"
import earningsIcon from "../../../assets/images/icon-transactions.svg"
import withdrawalIcon from "../../../assets/images/icon-withdrawal.svg"

const { Option } = Select;

const Transactions = () => {
  const navigate = useNavigate();
  const [transferTransaction, { isLoading: isTransferring }] = useTransferTransactionMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState({
    keyword: "",
    limit: 10,
    isRefundRequested: "",
    type: "",
    status: "",
  });

  const limit = Number(searchQuery.limit) || 15;

  const getCleanParams = () => {
    const params = {
      page: currentPage,
      keyword: searchQuery.keyword || "",
      limit: searchQuery.limit || 10,
    };
    if (searchQuery.isRefundRequested !== "") params.isRefundRequested = searchQuery.isRefundRequested;
    if (searchQuery.type) params.type = searchQuery.type;
    if (searchQuery.status) params.status = searchQuery.status;
    return params;
  };

  const { data: response, isLoading, isError } = useGetTransferAllQuery(getCleanParams());

  const [form] = Form.useForm();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const onFinish = (values) => {
    setSearchQuery({
      keyword: values.keyword?.trim() || "",
      limit: values.limit || 10,
      isRefundRequested: values.isRefundRequested,
      type: values.type,
      status: values.status,
    });
  };

  const columns = [
    {
      title: "CustomerID",
      dataIndex: ["userId", "id"],
      key: "customerId",
      render: (text, record) => (
        <div className="flex items-center">
          <div
            title={record.status || "Unknown status"}
            className={`w-2 h-6 me-2 rounded-md ${record.status === "received"
              ? "bg-green-500"
              : record.status === "created"
                ? "bg-yellow-500"
                : record.status === "refunded"
                  ? "bg-black"
                  : "bg-red-500"
              }`}
          />
          {text || "N/A"}
        </div>
      ),
    },
    {
      title: "Customer Name",
      dataIndex: ["userId", "name"],
      key: "customerName",
      render: (text) => text || "N/A",
    },
    {
      title: "ProviderId",
      dataIndex: ["providerId", "id"],
      key: "providerId",
      render: (text) => text || "N/A",
    },
    {
      title: "Provider Name",
      dataIndex: ["providerId", "name"],
      key: "providerName",
      render: (text) => text || "N/A",
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
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (text) => <span>${isNaN(Number(text)) ? "0.00" : Number(text).toFixed(2)}</span>,
    },
    {
      title: "Final",
      dataIndex: "minAmount",
      key: "minAmount",
      render: (text) => <span>${isNaN(Number(text)) ? "0.00" : Number(text).toFixed(2)}</span>,
    },
    {
      title: "Negotiate",
      dataIndex: "negAmount",
      key: "negAmount",
      render: (text) => <span>${isNaN(Number(text)) ? "0.00" : Number(text).toFixed(2)}</span>,
    },
    // {
    //   title: "Type",
    //   dataIndex: "type",
    //   key: "type",
    //   render: (text) => <span>{text}</span>,
    // },
    {
      title: "Ago",
      dataIndex: "ago",
      key: "ago",
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (record) => {
    //     if (record.status === "received") {
    //       return (
    //         <Button className="bg-gray-500 text-white w-24 py-1 rounded-md mr-1" disabled>
    //           Transferred
    //         </Button>
    //       );
    //     }
    //     if (record.status === "refunded") {
    //       return (
    //         <Button className="bg-black text-white w-24 py-1 rounded-md mr-1" disabled>
    //           Refunded
    //         </Button>
    //       );
    //     }
    //     if (record.isRefundRequested) {
    //       return (
    //         <Button
    //           className="bg-1 text-white w-24 py-1 rounded-md mr-1"
    //           onClick={() => navigate("/refund-details/" + record._id)}
    //         >
    //           Refund
    //         </Button>
    //       );
    //     }
    //     return (
    //       <Button
    //         className="bg-green-600 text-white w-24 py-1 rounded-md mr-1"
    //         onClick={() => transferTransaction({ id: record._id })}
    //       >
    //         Transfer Now
    //       </Button>
    //     );
    //   },
    // },
  ];

  const payments = response?.data?.transactions ?? [];
  const defaultTimeHour = response?.data?.defaultTimeHour ?? [];
  const appBalance = response?.data?.appBalance ?? 0;
  const totalWithdrawal = response?.data?.totalWithdrawal ?? 0;
  const totalEarnings = response?.data?.totalEarnings ?? 0;

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
        <div className="p-2 flex justify-between items-center bg-4">
          <PageHeading title="Transactions" disbaledBackBtn={true} />

          <Form
            form={form}
            layout="inline"
            className="flex items-center gap-x-2"
            initialValues={searchQuery}
            onFinish={onFinish}
          >
            <Form.Item name="limit" rules={[{ type: "number", min: 5, max: 1000, transform: (value) => Number(value) }]}>
              <InputNumber min={5} max={1000} step={5} placeholder="Limit" className="w-[90px]" />
            </Form.Item>

            {/* <Form.Item name="isRefundRequested" noStyle>
              <Select placeholder="Refund Requested" style={{ width: 140 }}>
                <Option value="">Refund Req?</Option>
                <Option value="true">Yes</Option>
                <Option value="false">No</Option>
              </Select>
            </Form.Item> */}

            {/* <Form.Item name="type" noStyle>
              <Select placeholder="Type" style={{ width: 140 }}>
                <Option value="">Select Type</Option>
                <Option value="transport">Transport</Option>
                <Option value="service">Service</Option>
              </Select>
            </Form.Item> */}

            <Form.Item name="status" noStyle>
              <Select placeholder="Status" style={{ width: 140 }}>
                <Option value="">Select Status</Option>
                <Option value="created">Created</Option>
                <Option value="received">Received</Option>
                <Option value="failed">Failed</Option>
                <Option value="refunded">Refunded</Option>
              </Select>
            </Form.Item>

            <Form.Item name="keyword" noStyle>
              <Input placeholder="User ID" className="focus:outline-none outline-none placeholder:text-[#222222] px-3.5 text-sm w-[170px] ms-3" />
            </Form.Item>

            <Form.Item noStyle>
              <Button type="primary" htmlType="submit" className="bg-s-1 ms-1" shape="circle" icon={<IoSearch />} />
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
          {/*<span className="text-sm text-yellow-500">
            <strong>Note:</strong> Balance will transfer to the provider's account by default after {defaultTimeHour} hours.
          </span>*/}
          <Table
            loading={isLoading}
            columns={columns}
            dataSource={payments.map((item, index) => ({ ...item, key: index + 1 }))}
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

export default Transactions;