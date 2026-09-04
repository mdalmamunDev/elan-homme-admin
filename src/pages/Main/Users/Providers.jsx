import { useState, useEffect } from "react";
import { Button, Input, InputNumber, Select, Form } from "antd";
import { IoSearch } from "react-icons/io5";

import { useGetAllUserQuery } from "../../../redux/features/Users/usersApi";

import PageHeading from "../../../Components/PageHeading";

import LoaderWraperComp from "../../../Components/LoaderWraperComp";
import ProviderListTable from "../../../Components/ProviderListTable";
import { FaUsers } from "react-icons/fa";

const { Option } = Select;

const Providers = () => {
  const [searchQuery, setSearchQuery] = useState({
    keyword: "",
    role: "provider",
    limit: 10,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const { data: usersData, isLoading, isError } = useGetAllUserQuery({
    page: currentPage,
    limit: searchQuery.limit,
    keyword: searchQuery.keyword,
    role: searchQuery.role,
  });

  // Form instance
  const [form] = Form.useForm();

  // Reset page to 1 on searchQuery change (except initial load)
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // When currentPage changes, fetch users is handled automatically by RTK Query hook

  // Handle form submit (enter or button click)
  const onFinish = (values) => {
    setSearchQuery({
      keyword: values.keyword?.trim() || "",
      role: "provider",
      limit: values.limit || 10,
    });
  };

  return (
    <div className="py-[16px]">
      <LoaderWraperComp isError={isError} isLoading={isLoading}>
        <div className="rounded-lg border-2 border-gray-200 shadow-sm p-4 mb-8">
          <div className="flex items-center space-x-4">
            {/* Icon Container */}
            <div className="w-12 h-12 bg-s-1 rounded-lg flex items-center justify-center">
              <FaUsers className="w-6 h-6 text-white" />
            </div>

            {/* Text Content */}
            <div>
              <h3 className="text-3xl font-bold text-s-1">Total Driver</h3>
              <p className="text-lg font-semibold text-s-2">{usersData?.pagination?.totalCount || 0}</p>
            </div>
          </div>
        </div>
        <div className="p-2 flex justify-between items-center">
          <PageHeading title={"All Driver's List"} disbaledBackBtn={true} />

          {/* Filters Form */}
          <Form
            form={form}
            layout="inline"
            className="flex items-center gap-x-2"
            initialValues={{
              limit: searchQuery.limit,
              role: searchQuery.role,
              keyword: searchQuery.keyword,
            }}
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

            {/* <Form.Item name="role" noStyle>
              <Select
                placeholder="Select Role"
                allowClear
                style={{ width: 140 }}
              >
                <Option value="">Select Role</Option>
                <Option value="admin">Admin</Option>
                <Option value="customer">Customer</Option>
                <Option value="mechanic">Mechanic</Option>
                <Option value="tow_truck">Tow Truck</Option>
              </Select>
            </Form.Item> */}

            <Form.Item name="keyword" noStyle>
              <Input
                placeholder="User Name/Email/ID/Phone"
                className="focus:outline-none outline-none placeholder:text-[#222222] px-3.5 text-sm w-[170px]"
                allowClear
              />
            </Form.Item>

            <Form.Item noStyle>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-s-1"
                shape="circle"
                icon={<IoSearch />}
              />
            </Form.Item>
          </Form>
        </div>

        <ProviderListTable
          pagination={usersData?.pagination}
          data={usersData?.data}
          setCurrentPage={setCurrentPage}
        />
      </LoaderWraperComp>
    </div>
  );
};

export default Providers;
