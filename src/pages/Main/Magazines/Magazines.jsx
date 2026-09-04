import React, { useState, useEffect } from "react";
import { Button, Form, Input, InputNumber, Select, Table } from "antd";
import { IoSearch } from "react-icons/io5";

import PageHeading from "../../../Components/PageHeading";

import {
  useDeleteMagazineMutation,
  useGetAllMagazinesQuery,
  useStoreMagazineMutation,
  useUpdateMagazineMutation,
} from "../../../redux/features/magazine/magazinesApi";
import DashboardModal from "../../../Components/DashboardModal";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import LoaderWraperComp from "../../../Components/LoaderWraperComp";

const Magazines = () => {
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();

  const [searchQuery, setSearchQuery] = useState({
    keyword: "",
    limit: 10,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});

  const [storeMagazine] = useStoreMagazineMutation();
  const [updateMagazine] = useUpdateMagazineMutation();
  const [deleteMagazine] = useDeleteMagazineMutation();

  // Fetch magazines using searchQuery and currentPage
  const { data: response, isLoading, isError } = useGetAllMagazinesQuery({
    page: currentPage,
    ...searchQuery,
  });

  const magazines = response?.data || [];
  const pagination = response?.pagination || {};

  const columns = [
    {
      title: "Cover",
      dataIndex: "coverImage",
      key: "coverImage",
      render: (coverImage, record) => (
        <div className="flex">
          <div
            title={record.isActive ? "active" : "inactive"}
            className={`w-1 me-2 rounded-md ${record.isActive ? "bg-green-500" : "bg-red-500"}`}
          ></div>
          <div>
            <img
              className="aspect-[3/4] w-14 object-cover"
              src={`${import.meta.env.VITE_IMAGE_URL}/${coverImage}`}
              alt={record.title || "Magazine cover"}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (value) => value === 0 ? 0 : value || "N/A",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (value) => value || "N/A",
    },
    {
      title: "Price",
      dataIndex: "pricing",
      key: "pricing",
      render: (pricing = []) => pricing.length
        ? pricing.map(({ country, currency, price }) => `${country}: ${currency} ${price}`).join(", ")
        : "N/A",
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => createdAt ? new Date(createdAt).toLocaleDateString() : "N/A",
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
      title: record.title || "",
      slug: record.slug || "",
      description: record.description || "",
      coverImage: record.coverImage || "",
      isActive: record.isActive ?? true,
      pricing: record.pricing?.length
        ? record.pricing
        : [{ country: "", currency: "", price: 0 }],
    });
  };

  const onFinish = async (values) => {
    try {
      if (modalData._id) {
        await updateMagazine({ id: modalData._id, payload: values });
        toast.success("Magazine updated successfully.");
      } else {
        await storeMagazine(values);
        toast.success("Magazine added successfully.");
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
      text: "Do you want to delete this magazine?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteMagazine({ id });
      toast.success("Magazine deleted successfully.");
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
            <PageHeading title={"All Magazines"} disbaledBackBtn={true} />

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
                  placeholder="Magazine title"
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
          dataSource={magazines}
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
              <h6 className="font-medium text-center text-xl pb-1">Magazine</h6>
              <Form
                form={modalForm}
                name="edit_magazine"
                layout="vertical"
                requiredMark={false}
                onFinish={onFinish}
                className="space-y-[24px]"
              >
                <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                  <Input size="large" placeholder="Enter magazine title" />
                </Form.Item>
                <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
                  <Input size="large" placeholder="Enter magazine slug" />
                </Form.Item>
                <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                  <Input.TextArea rows={3} placeholder="Enter magazine description" />
                </Form.Item>
                <Form.Item name="coverImage" label="Cover image" rules={[{ required: true }]}>
                  <Input size="large" placeholder="Enter cover image path" />
                </Form.Item>
                <Form.Item name="isActive" label="Status" rules={[{ required: true }]}>
                  <Select
                    size="middle"
                    className="w-full h-10"
                    placeholder="Select status"
                    options={[
                      { label: "Active", value: true },
                      { label: "Inactive", value: false },
                    ]}
                  />
                </Form.Item>
                <Form.List name="pricing">
                  {(fields, { add, remove }) => (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Pricing</span>
                        <Button type="dashed" onClick={() => add({ country: "", currency: "", price: 0 })}>
                          Add price
                        </Button>
                      </div>
                      {fields.map(({ key, name, ...restField }) => (
                        <div key={key} className="flex items-start gap-2">
                          <Form.Item {...restField} name={[name, "country"]} rules={[{ required: true }]} className="mb-0 flex-1">
                            <Input placeholder="Country" />
                          </Form.Item>
                          <Form.Item {...restField} name={[name, "currency"]} rules={[{ required: true }]} className="mb-0 flex-1">
                            <Input placeholder="Currency" />
                          </Form.Item>
                          <Form.Item {...restField} name={[name, "price"]} rules={[{ required: true, type: "number" }]} className="mb-0 flex-1">
                            <InputNumber min={0} className="w-full" placeholder="Price" />
                          </Form.Item>
                          {fields.length > 1 && <Button type="text" danger onClick={() => remove(name)}>Remove</Button>}
                        </div>
                      ))}
                    </div>
                  )}
                </Form.List>
                <Form.Item>
                  <Button
                    size="large"
                    htmlType="submit"
                    className="w-full bg-s-1 text-white"
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

export default Magazines;
