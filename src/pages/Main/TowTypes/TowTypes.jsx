import React, { useState, useEffect } from "react";
import { Button, Form, Input, InputNumber, Table } from "antd";
import { IoSearch } from "react-icons/io5";

import PageHeading from "../../../Components/PageHeading";

import {
  useDeleteTowTypeMutation,
  useGetAllTowTypesQuery,
  useStoreTowTypeMutation,
  useUpdateTowTypeMutation,
} from "../../../redux/features/towTypes/towTypesApi";
import DashboardModal from "../../../Components/DashboardModal";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import LoaderWraperComp from "../../../Components/LoaderWraperComp";

const TowTypes = () => {
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();

  const [searchQuery, setSearchQuery] = useState({
    keyword: "",
    limit: 10,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});

  const [storeTowType] = useStoreTowTypeMutation();
  const [updateTowType] = useUpdateTowTypeMutation();
  const [deleteTowType] = useDeleteTowTypeMutation();

  // Fetch towTypes using searchQuery and currentPage
  const { data: response, isLoading, isError } = useGetAllTowTypesQuery({
    page: currentPage,
    ...searchQuery,
  });

  const towTypes = response?.data || [];
  const pagination = response?.pagination || {};

  const columns = [
    {
      title: "Tow Type",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Base Fare",
      dataIndex: "baseFare",
      key: "baseFare",
      render: (baseFare) => baseFare === 0 ? 0 : baseFare || "N/A",
    },
    {
      title: "Cost/KM",
      dataIndex: "perKM",
      key: "perKM",
      render: (perKM) => perKM === 0 ? 0 : perKM || "N/A",
    },
    {
      title: "Charge",
      dataIndex: "charge",
      key: "charge",
      render: (charge) => charge === 0 ? 0 : charge || "N/A",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div className="flex gap-x-4">
          <FaEdit
            size={18}
            className="cursor-pointer text-yellow-600"
            title="Edit"
            onClick={() => showModal(record)}
          />
          <FaTrash
            size={18}
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

  const onFinish = async (values) => {
    try {
      if (modalData._id) {
        await updateTowType({ id: modalData._id, payload: values });
        toast.success("Tow type updated successfully.");
      } else {
        await storeTowType(values);
        toast.success("Tow type added successfully.");
      }
      setIsModalOpen(false);
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

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this tow type?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteTowType({ id });
      toast.success("Tow type deleted successfully.");
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

  return (
    <div className="py-[16px]">
      <LoaderWraperComp isError={isError} isLoading={isLoading}>
        <div className="flex gap-2 bg-4">
          <div className="p-2 flex-1 flex justify-between items-center">
            <PageHeading title={"Pricing & Tow Types"} disbaledBackBtn={true} />

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
                  placeholder="Tow Type"
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

          <Button
            onClick={() => showModal()}
            type="primary"
            className="bg-s-1 rounded-none"
            loading={isLoading}
            style={{ height: 'inherit' }}
          >
            <FaPlus /> Add New
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={towTypes}
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

        <DashboardModal setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen}>
          <div className="flex flex-col justify-between text-base">
            <div className="space-y-7">
              <h6 className="font-medium text-center text-xl pb-1">Pricing/Tow Type</h6>
              <Form
                form={modalForm}
                name="edit_towType"
                layout="vertical"
                requiredMark={false}
                onFinish={onFinish}
                className="space-y-[24px]"
              >
                <Form.Item name="name" label="Name" rules={[{ required: true }]}> 
                  <Input
                    size="large"
                    className=""
                    placeholder="Enter tow type name"
                  />
                </Form.Item>
                <Form.Item name="baseFare" label="Base Fare" rules={[{ required: true, type: "number", message: "Base Fare is required" }]}> 
                  <InputNumber
                    size="large"
                    className="w-full"
                    placeholder="Enter base fare"
                    min={0}
                  />
                </Form.Item>
                <Form.Item name="perKM" label="Cost/KM" rules={[{ required: true, type: "number", message: "Cost/KM is required" }]}> 
                  <InputNumber
                    size="large"
                    className="w-full"
                    placeholder="Enter cost per KM"
                    min={0}
                  />
                </Form.Item>
                <Form.Item name="charge" label="Charge" rules={[{ required: true, type: "number", message: "Charge is required" }]}> 
                  <InputNumber
                    size="large"
                    className="w-full"
                    placeholder="Enter charge"
                    min={0}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    size="large"
                    htmlType="submit"
                    className="w-full bg-s-1 text-white rounded-full"
                    loading={isLoading}
                  >
                    Submit
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

export default TowTypes;
