import { useState, useEffect } from "react";
import { Button, Form, InputNumber, Select, Table, Tag } from "antd";
import { FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import PageHeading from "../../../Components/PageHeading";
import DashboardModal from "../../../Components/DashboardModal";
import LoaderWraperComp from "../../../Components/LoaderWraperComp";

import {
  useGetAllSubscriptionsQuery,
  useAdminCreateSubscriptionMutation,
  useAdminUpdateSubscriptionStatusMutation,
} from "../../../redux/features/subscription/subscriptionsApi";
import { useGetAllMagazinesQuery } from "../../../redux/features/magazine/magazinesApi";
import { useGetAllUserQuery } from "../../../redux/features/Users/usersApi";

const STATUS_COLORS = {
  active: "green",
  pending: "gold",
  cancelled: "red",
  expired: "default",
};

const Subscriptions = () => {
  const [grantForm] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);

  const {
    data: response,
    isLoading,
    isError,
  } = useGetAllSubscriptionsQuery({ page: currentPage, limit });

  const subscriptions = response?.data || [];
  const pagination = response?.pagination || {};

  const { data: magazinesRes } = useGetAllMagazinesQuery({ page: 1, limit: 100 });
  const magazines = magazinesRes?.data || [];

  const { data: usersRes } = useGetAllUserQuery({ page: 1, limit: 100 });
  const users = usersRes?.data || [];

  const [adminCreateSubscription] = useAdminCreateSubscriptionMutation();
  const [adminUpdateSubscriptionStatus] = useAdminUpdateSubscriptionStatusMutation();

  const handleToggleStatus = async (record) => {
    const targetStatus = record.status === "active" ? "cancelled" : "active";
    const actionLabel = targetStatus === "active" ? "activate" : "deactivate";

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${actionLabel} this subscription for ${record?.magazineId?.title || "this magazine"}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionLabel} it!`,
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;

    try {
      await adminUpdateSubscriptionStatus({
        id: record._id,
        status: targetStatus,
      }).unwrap();
      toast.success(`Subscription ${actionLabel}d successfully.`);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed!!",
        text:
          (error?.data?.message || error.message || "Something went wrong.") +
          " Please try again later.",
      });
    }
  };

  const onGrantFinish = async (values) => {
    try {
      await adminCreateSubscription(values).unwrap();
      toast.success("Subscription granted successfully.");
      setIsGrantModalOpen(false);
      grantForm.resetFields();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed!!",
        text:
          (error?.data?.message || error.message || "Something went wrong.") +
          " Please try again later.",
      });
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [limit]);
const columns = [
    {
      title: "User",
      dataIndex: "userId",
      key: "userId",
      render: (user) => (
        <div>
          <div className="font-medium">{user?.name || "N/A"}</div>
          <div className="text-xs text-gray-500">{user?.email || ""}</div>
        </div>
      ),
    },
    {
      title: "Magazine",
      dataIndex: "magazineId",
      key: "magazineId",
      render: (mag) => mag?.title || "N/A",
    },
    {
      title: "Period",
      dataIndex: "period",
      key: "period",
      render: (period) => `${period} month${period === 1 ? "" : "s"}`,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price, record) =>
        price !== undefined ? `${record.currency || ""} ${price}` : "N/A",
    },
    {
      title: "Start",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
    {
      title: "End",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={STATUS_COLORS[status] || "default"}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          size="small"
          type={record.status === "active" ? "default" : "primary"}
          danger={record.status === "active"}
          onClick={() => handleToggleStatus(record)}
        >
          {record.status === "active" ? "Deactivate" : "Activate"}
        </Button>
      ),
    },
  ];
return (
    <div className="py-[16px]">
      <LoaderWraperComp isError={isError} isLoading={isLoading}>
        <div className="flex gap-2 bg-4">
          <div className="p-2 flex-1 flex justify-between items-center">
            <PageHeading title="All Subscriptions" disbaledBackBtn={true} />
          </div>

          <InputNumber
            min={5}
            max={100}
            step={5}
            value={limit}
            onChange={(val) => setLimit(val || 10)}
            placeholder="Limit"
            className="w-[90px] self-center"
          />

          <Button
            onClick={() => setIsGrantModalOpen(true)}
            type="primary"
            className="bg-s-1 rounded-none"
            style={{ height: "inherit" }}
          >
            <FaPlus /> Grant Subscription
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={subscriptions}
          rowKey={(record) => record._id}
          pagination={{
            current: pagination.currentPage || currentPage,
            pageSize: pagination.itemsPerPage || limit,
            total: pagination.totalCount || 0,
            showSizeChanger: false,
            position: ["bottomCenter"],
            onChange: (page) => setCurrentPage(page),
          }}
          loading={isLoading}
          className="mt-6"
          scroll={{ x: 900 }}
        />

        <DashboardModal
          setIsModalOpen={setIsGrantModalOpen}
          isModalOpen={isGrantModalOpen}
          width="520"
        >
          <div className="flex flex-col justify-between text-base">
            <div className="space-y-7">
              <h6 className="font-medium text-center text-xl pb-1">
                Grant Subscription
              </h6>
              <Form
                form={grantForm}
                name="grant_subscription"
                layout="vertical"
                requiredMark={false}
                onFinish={onGrantFinish}
                initialValues={{ orderType: "self", period: 12 }}
                className="space-y-[24px]"
              >
                <Form.Item
                  name="userId"
                  label="User"
                  rules={[{ required: true, message: "Please select a user" }]}
                >
                  <Select
                    showSearch
                    optionFilterProp="label"
                    placeholder="Select user"
                    options={users.map((u) => ({
                      label: `${u.name || u.email} (${u.email || ""})`,
                      value: u._id,
                    }))}
                    className="w-full"
                  />
                </Form.Item>
                <Form.Item
                  name="magazineId"
                  label="Magazine"
                  rules={[
                    { required: true, message: "Please select a magazine" },
                  ]}
                >
                  <Select
                    showSearch
                    optionFilterProp="label"
                    placeholder="Select magazine"
                    options={magazines.map((m) => ({
                      label: m.title,
                      value: m._id,
                    }))}
                    className="w-full"
                  />
                </Form.Item>
                <Form.Item name="period" label="Period (months)">
                  <InputNumber min={1} className="w-full" placeholder="e.g. 12" />
                </Form.Item>
                <Form.Item name="orderType" label="Order type">
                  <Select
                    options={[
                      { label: "Self", value: "self" },
                      { label: "Gift", value: "gift" },
                    ]}
                    className="w-full"
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    size="large"
                    htmlType="submit"
                    className="w-full bg-s-1 text-white"
                  >
                    Grant Subscription
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </DashboardModal>
      </LoaderWraperComp>
    </div>
  );
};

export default Subscriptions;