import React, { useState } from "react";
import { Modal, message } from "antd";
import { useParams } from "react-router-dom";
import { useGetTransferQuery, useResponseRefundMutation } from "../../../redux/features/payments/transactionApi";
import LoaderWraperComp from "../../../Components/LoaderWraperComp";
import PageHeading from "../../../Components/PageHeading";

const RefundDetails = () => {
  const { id } = useParams();
  const { data: response, isLoading, isError } = useGetTransferQuery(id);
  const transaction = response?.data || {};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  // Refund Mutation
  const [responseRefund, { isLoading: isRefunding }] = useResponseRefundMutation();

  const showImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const handleRefundResponse = async (refunded) => {
    try {
      await responseRefund({ id, refunded }).unwrap();
      message.success(refunded ? "Refund accepted successfully." : "Refund rejected.");
    } catch (error) {
      message.error(error?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="py-[16px]">
      <LoaderWraperComp isError={isError} isLoading={isLoading}>
        <div className="p-2 flex justify-between items-center bg-4">
          <PageHeading title={"Refund Details"} />
        </div>

        <div className="mt-4">
          {/* Header Section */}
          <div className="border-2 border-[#d2d2ff] p-1 rounded-xl bg-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-white text-black text-sm font-semibold p-3 rounded-xl">
                Key information
              </span>
              <span className="bg-[#8f8ff1] text-white text-sm font-semibold px-3 py-1 rounded-full">
                {transaction?.customerId?.name || "N/A"}
              </span>
              <span className="bg-[#8f8ff1] text-white text-sm font-semibold px-3 py-1 rounded-full">
                {transaction?.customerId?.email || "N/A"}
              </span>
              <span className="bg-[#8f8ff1] text-white text-sm font-semibold px-3 py-1 rounded-full">
                {transaction?.customerId?.phone || "N/A"}
              </span>
              <span className="bg-[#8f8ff1] text-white text-sm font-semibold px-3 py-1 rounded-full">
                ${transaction?.amount || 0}
              </span>
            </div>
          </div>

          <div className="h-[60vh] overflow-auto bg-blue-50 px-8 pb-8">
            {/* Message Section */}
            <div className="mt-6 text-[15px] leading-[1.7]">
              <p>{transaction?.refundDetails || "N/A"}</p>
            </div>

            {/* Image Section */}
            <div className="flex flex-wrap gap-4 mt-6">
              {transaction?.refundImages?.map((image, index) => {
                const fullImageUrl = `${import.meta.env.VITE_IMAGE_URL}/${image}`;
                return (
                  <div
                    key={index}
                    className="cursor-pointer rounded-lg overflow-hidden shadow-sm border border-gray-200"
                    onClick={() => showImageModal(fullImageUrl)}
                  >
                    <img
                      src={fullImageUrl}
                      alt={`Refund issue ${index + 1}`}
                      className="w-[150px] h-[100px] object-cover"
                    />
                    <div className="text-center py-1 text-blue-600 text-sm font-medium">
                      Images.jpg
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Refund Buttons */}
          <div className="mt-6 flex justify-center gap-4">
            {transaction?.status === "success" ? (
              <button
                className="bg-gray-400 text-white p-2 rounded-full w-full text-lg font-semibold cursor-not-allowed"
                disabled
              >
                Balance already transferred
              </button>
            ) : transaction?.status === "refunded" ? (
              <button
                className="bg-green-500 text-white p-2 rounded-full w-full text-lg font-semibold cursor-not-allowed"
                disabled
              >
                Refunded
              </button>
            ) : transaction?.isRefundRequested ? (
              <>
                <button
                  onClick={() => handleRefundResponse(false)}
                  className="bg-red-500 text-white p-2 rounded-full w-1/2 text-lg font-semibold hover:opacity-90"
                  disabled={isRefunding}
                >
                  Transfer To Provider
                </button>
                <button
                  onClick={() => handleRefundResponse(true)}
                  className="bg-1 text-white p-2 rounded-full w-1/2 text-lg font-semibold hover:opacity-90"
                  disabled={isRefunding}
                >
                  Refund
                </button>
              </>
            ) : null}
          </div>
        </div>
      </LoaderWraperComp>

      {/* Image Preview Modal */}
      <Modal
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        centered
        width={600}
      >
        <img src={selectedImage} alt="Preview" className="w-full h-auto object-contain" />
      </Modal>
    </div>
  );
};

export default RefundDetails;
