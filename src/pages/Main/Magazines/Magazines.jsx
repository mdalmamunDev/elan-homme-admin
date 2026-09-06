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
import { PiCameraPlus } from "react-icons/pi";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import LoaderWraperComp from "../../../Components/LoaderWraperComp";
import { useUploadSingleMutation } from "../../../redux/features/upload/uploadApi";

// Country and currency options for pricing
const countryOptions = [
  { label: "Austria (AT)", value: "AT" },
  { label: "Belgium (BE)", value: "BE" },
  { label: "Croatia (HR)", value: "HR" },
  { label: "Cyprus (CY)", value: "CY" },
  { label: "Estonia (EE)", value: "EE" },
  { label: "Finland (FI)", value: "FI" },
  { label: "France (FR)", value: "FR" },
  { label: "Germany (DE)", value: "DE" },
  { label: "Greece (GR)", value: "GR" },
  { label: "Ireland (IE)", value: "IE" },
  { label: "Italy (IT)", value: "IT" },
  { label: "Latvia (LV)", value: "LV" },
  { label: "Lithuania (LT)", value: "LT" },
  { label: "Luxembourg (LU)", value: "LU" },
  { label: "Malta (MT)", value: "MT" },
  { label: "Netherlands (NL)", value: "NL" },
  { label: "Portugal (PT)", value: "PT" },
  { label: "Slovakia (SK)", value: "SK" },
  { label: "Slovenia (SI)", value: "SI" },
  { label: "Spain (ES)", value: "ES" },
];

// Only EUR for Eurozone countries
const currencyOptions = [
  { label: "EUR", value: "EUR" },
];

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
  const [coverImage, setCoverImage] = useState("");

  const [storeMagazine] = useStoreMagazineMutation();
  const [updateMagazine] = useUpdateMagazineMutation();
  const [deleteMagazine] = useDeleteMagazineMutation();
  const [uploadSingle, { isLoading: uploading }] = useUploadSingleMutation();

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
        ? pricing.map(({ country, currency, price }) => `${countryOptions.find((c) => c.value === country)?.label || country}: ${currency} ${price}`).join(", ")
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
    setCoverImage(record.coverImage || "");
    modalForm.setFieldsValue({
      title: record.title || "",
      slug: record.slug || "",
      description: record.description || "",
      isActive: record.isActive ?? true,
      pricing: record.pricing?.length
        ? record.pricing
        : [{ country: "", currency: "EUR", price: 0 }],
    });
  };

  const handleCoverUpload = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      try {
        const file = e.target.files[0];
        const res = await uploadSingle(file).unwrap();
        setCoverImage(res?.data?.filename);
        toast.success("Cover image uploaded successfully!");
      } catch (error) {
        toast.error("Cover image upload failed.");
      } finally {
        e.target.value = "";
      }
    }
  };

  const onFinish = async (values) => {
    try {
      if (!coverImage) {
        toast.error("Please upload a cover image.");
        return;
      }
      const payload = { ...values, coverImage };
      if (modalData._id) {
        await updateMagazine({ id: modalData._id, payload });
        toast.success("Magazine updated successfully.");
      } else {
        await storeMagazine(payload);
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
                {/* Cover image at the top, centered */}
                <Form.Item label="Cover image" required>
                  <label htmlFor="magazineCover" className="cursor-pointer block flex justify-center">
                    <div className="relative h-[290px] w-[220px] bg-[#f0f1f8] border-2 border-dashed border-[#5680C0] rounded-lg flex flex-col items-center justify-center overflow-hidden">
                      {uploading && (
                        <div className="absolute inset-0 bg-[#222222bb] flex flex-col justify-center items-center text-white z-10">
                          <span className="text-sm">Uploading...</span>
                        </div>
                      )}
                      {coverImage ? (
                        <img
                          src={`${import.meta.env.VITE_IMAGE_URL}/${coverImage}`}
                          alt="Magazine cover"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-[#5680C0]">
                          <PiCameraPlus size={44} />
                          <span className="mt-2 text-sm">Click to upload</span>
                        </div>
                      )}
                    </div>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    id="magazineCover"
                    name="coverImage"
                    multiple={false}
                    style={{ display: "none" }}
                    onChange={handleCoverUpload}
                  />
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    {coverImage
                      ? "Click image to change"
                      : "Upload a magazine cover image"}
                  </p>
                </Form.Item>
                <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                  <Input size="large" placeholder="Enter magazine title" />
                </Form.Item>
                <Form.Item
                  name="slug"
                  label="Slug"
                  rules={[
                    { required: true },
                    {
                      pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                      message: "Slug can only contain lowercase letters, numbers, and hyphens (no spaces or special characters).",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="e.g. my-magazine-2025"
                    onChange={(e) => {
                      const { value } = e.target;
                      // Keep only URL-safe characters while typing: lowercase letters, numbers, and hyphens
                      const sanitized = value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "")
                        .replace(/-+/g, "-");
                      modalForm.setFieldValue("slug", sanitized);
                    }}
                  />
                </Form.Item>
                <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                  <Input.TextArea rows={3} placeholder="Enter magazine description" />
                </Form.Item>
                <Form.List name="pricing">
                  {(fields, { add, remove }) => (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Pricing</span>
                        <Button type="dashed" onClick={() => add({ country: "", currency: "EUR", price: 0 })}>
                          Add price
                        </Button>
                      </div>
                      {fields.map(({ key, name, ...restField }) => (
                        <div key={key} className="flex items-start gap-2">
                          <Form.Item {...restField} name={[name, "country"]} rules={[{ required: true }]} className="mb-0 flex-1">
                            <Select
                              placeholder="Country"
                              showSearch
                              optionFilterProp="label"
                              options={countryOptions}
                              className="w-full"
                            />
                          </Form.Item>
                          <Form.Item {...restField} name={[name, "currency"]} rules={[{ required: true }]} className="mb-0 flex-1">
                            <Select
                              placeholder="Currency"
                              options={currencyOptions}
                              className="w-full"
                            />
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
