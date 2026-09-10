import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Form, Input, InputNumber, Select, Table, Tag } from "antd";

import PageHeading from "../../../Components/PageHeading";
import DashboardModal from "../../../Components/DashboardModal";
import LoaderWraperComp from "../../../Components/LoaderWraperComp";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

import { useGetMagazineByIdQuery } from "../../../redux/features/magazine/magazinesApi";
import {
  useCreateIssueMutation,
  useDeleteIssueMutation,
  useGetIssuesQuery,
  useUpdateIssueMutation,
} from "../../../redux/features/issue/issuesApi";
import { FaEdit, FaFilePdf, FaPlus, FaTrash } from "react-icons/fa";
import { countryOptions } from "../../../constants/countryOptions";

const formatFileSize = (bytes) => {
  if (!bytes) return "N/A";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const MagazineDetails = () => {
  const { id: magazineId } = useParams();

  const [modalForm] = Form.useForm();
  const [pageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [issueFile, setIssueFile] = useState(null);

  const {
    data: magazineResponse,
    isLoading: magazineLoading,
    isError: magazineError,
  } = useGetMagazineByIdQuery(magazineId);

  const {
    data: issuesResponse,
    isLoading: issuesLoading,
    isError: issuesError,
  } = useGetIssuesQuery({
    magazineId,
    page: currentPage,
    limit: pageSize,
  });

  const [createIssue, { isLoading: creating }] = useCreateIssueMutation();
  const [updateIssue, { isLoading: updating }] = useUpdateIssueMutation();
  const [deleteIssue] = useDeleteIssueMutation();

  const magazine = magazineResponse?.data || {};
  const issues = issuesResponse?.data || [];
  const pagination = issuesResponse?.pagination || {};

  const pricingLabel =
    magazine?.pricing?.length
      ? magazine.pricing
          .map(
            ({ country, currency, price }) =>
              `${countryOptions.find((c) => c.value === country)?.label || country}: ${currency} ${price}`
          )
          .join(", ")
      : "N/A";

  const showModal = (record = {}) => {
    setModalData(record);
    setIssueFile(null);
    setIsModalOpen(true);
    modalForm.setFieldsValue({
      title: record.title || "",
      downloadLimit: record.downloadLimit || 1,
      isActive: record.isActive ?? true,
    });
  };

  const handleFileSelect = (e) => {
    setIssueFile(e.target.files?.[0] || null);
  };

  const onFinish = async (values) => {
    try {
      const payload = new FormData();
      payload.append("title", String(values.title || ""));
      payload.append("downloadLimit", String(values.downloadLimit || 1));

      if (modalData._id) {
        if (values.isActive !== undefined) {
          payload.append("isActive", String(values.isActive));
        }
        if (issueFile) payload.append("file", issueFile);
        await updateIssue({ id: modalData._id, payload });
        toast.success("Issue updated successfully.");
      } else {
        if (!issueFile) {
          toast.error("Please select a PDF file to upload.");
          return;
        }
        payload.append("magazineId", magazineId);
        payload.append("file", issueFile);
        await createIssue(payload);
        toast.success("Issue added successfully.");
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
      text: "Do you want to delete this issue?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteIssue({ id });
      toast.success("Issue deleted successfully.");
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

const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (value) => value || "N/A",
    },
    {
      title: "PDF",
      dataIndex: "filePath",
      key: "filePath",
      render: (filePath) =>
        filePath ? (
          <a
            href={`${import.meta.env.VITE_IMAGE_URL}/${filePath}`}
            target="_blank"
            rel="noreferrer"
            title="Open PDF"
          >
            <FaFilePdf size={18} className="text-s-1" />
          </a>
        ) : (
          "N/A"
        ),
    },
    {
      title: "File size",
      dataIndex: "fileSize",
      key: "fileSize",
      render: formatFileSize,
    },
    {
      title: "Download limit",
      dataIndex: "downloadLimit",
      key: "downloadLimit",
      render: (value) => value ?? 1,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (value) =>
        value ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
    {
      title: "Uploaded",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) =>
        value ? new Date(value).toLocaleDateString() : "N/A",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div className="flex gap-x-4">
          <FaEdit
            size={18}
            className="cursor-pointer text-yellow-600"
            title="Edit Issue"
            onClick={() => showModal(record)}
          />
          <FaTrash
            size={18}
            className="cursor-pointer text-red-600"
            title="Delete Issue"
            onClick={() => handleDelete(record._id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="py-[16px]">
      <LoaderWraperComp isError={magazineError} isLoading={magazineLoading}>
        <div className="flex gap-2 bg-4">
          <PageHeading className='p-2 flex-1' title={magazine?.title || "Magazine Details"} backPath="/magazine" />
          <Button
            onClick={() => showModal()}
            type="primary"
            className="bg-s-1 rounded-none"
            loading={creating || updating}
            style={{ height: "inherit" }}
          >
            <FaPlus /> Add Issue
          </Button>
        </div>

        {/* Magazine summary card */}
        <div className="mt-4 flex gap-4 bg-4 rounded-lg p-4">
          <img
            className="aspect-[3/4] w-32 object-cover rounded-md"
            src={`${import.meta.env.VITE_IMAGE_URL}/${magazine?.coverImage}`}
            alt={magazine?.title || "Magazine cover"}
          />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h6 className="text-lg font-medium">{magazine?.title || "N/A"}</h6>
              {magazine?.isActive ? (
                <Tag color="green">Active</Tag>
              ) : (
                <Tag color="red">Inactive</Tag>
              )}
            </div>
            <p className="text-sm">
              <span className="font-medium">Slug:</span> {magazine?.slug || "N/A"}
            </p>
            <p className="text-sm">
              <span className="font-medium">Description:</span>{" "}
              {magazine?.description || "N/A"}
            </p>
            <p className="text-sm">
              <span className="font-medium">Pricing:</span> {pricingLabel}
            </p>
          </div>
        </div>

        <LoaderWraperComp isError={issuesError} isLoading={issuesLoading}>
          <Table
            columns={columns}
            dataSource={issues}
            rowKey={(record) => record._id}
            pagination={{
              current: pagination.currentPage || currentPage,
              pageSize: pagination.itemsPerPage || pageSize,
              total: pagination.totalCount || 0,
              showSizeChanger: false,
              position: ["bottomCenter"],
              onChange: (page) => setCurrentPage(page),
            }}
            loading={issuesLoading}
            className="mt-6"
          />
        </LoaderWraperComp>

        <DashboardModal setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen}>
          <div className="flex flex-col justify-between text-base">
            <div className="space-y-7">
              <h6 className="font-medium text-center text-xl pb-1">
                {modalData._id ? "Edit Issue" : "Add Issue"}
              </h6>
              <Form
                form={modalForm}
                name="issue_form"
                layout="vertical"
                requiredMark={false}
                onFinish={onFinish}
                className="space-y-[24px]"
              >
                <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                  <Input size="large" placeholder="Enter issue title" />
                </Form.Item>
                <Form.Item label="PDF file" required={!modalData._id}>
                  <input type="file" accept=".pdf,application/pdf" onChange={handleFileSelect} />
                  <p className="text-xs text-gray-500 mt-1">
                    {issueFile
                      ? `Selected: ${issueFile.name}`
                      : modalData._id
                        ? "Upload a new PDF to replace the current one"
                        : "Upload the issue PDF (.pdf only)"}
                  </p>
                </Form.Item>
                <Form.Item
                  name="downloadLimit"
                  label="Download limit"
                  rules={[{ required: true, type: "number" }]}
                >
                  <InputNumber min={1} className="w-full" placeholder="e.g. 3 (per user)" />
                </Form.Item>
                {modalData._id && (
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
                )}
                <Form.Item>
                  <Button
                    size="large"
                    htmlType="submit"
                    className="w-full bg-s-1 text-white"
                    loading={creating || updating}
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

export default MagazineDetails;