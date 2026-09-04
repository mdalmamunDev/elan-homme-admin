import { FaChevronLeft, FaBuilding, FaEnvelope, FaPhone, FaTruck, FaMapMarkerAlt, FaCalendarAlt, FaVenusMars, FaIdCard, FaCar } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { useAcceptVerificationMutation, useGetProviderQuery, useUpdateUserMutation } from '../../../redux/features/Users/usersApi';
import profileImage from "../../../assets/images/admin.png";
import { useState } from 'react';
import DashboardModal from '../../../Components/DashboardModal';
import { HiBadgeCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const ProviderDetails = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const id = queryParams.get('id');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState();
  const showModal = (record) => {
    setModalData(record);
    setIsModalOpen(true);
  };

  const [updateUser, { isLoading: isLoadingStatus }] = useUpdateUserMutation();
  const resetActivation = async (status) => {
      try {
        await updateUser({ id: provider.userId, payload: {status} }).unwrap();
        toast.success("Driver updated successfully.");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Failed!!",
          text: error.message || error?.data?.message || "Something went wrong.",
        });
      }
    };

  const [acceptVerification, { isLoading: isLoadingVerify }] = useAcceptVerificationMutation();
  const acceptProvider = async (isVerified) => {
      try {
        await acceptVerification({ id: provider.userId, isVerified }).unwrap();
        toast.success("Driver verified successfully.");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Failed!!",
          text: error.message || error?.data?.message || "Something went wrong.",
        });
      }
    };


  const { data: response, isLoading, isError } = useGetProviderQuery(id);
  const provider = response?.data;
  if(!provider) return 'Something went wrong';
  return (
    <div className="min-h-screen">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-2 p-4 rounded-md shadow">
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <FaChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                <img
                  src={
                    provider?.profileImage
                      ? `${import.meta.env.VITE_IMAGE_URL}/` +
                      provider?.profileImage
                      : profileImage
                  }
                  alt="Driver"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h1 className="text-xl font-semibold text-gray-800">Name</h1>
                <p className="text-gray-600">{provider.name || 'N/A'}</p>
              </div>
            </div>
          </div>

          {provider?.isVerified ? (
            <div className="flex space-x-3">
              <div className="px-6 py-2 text-green-600 text-xl font-bold flex gap-2">
                Verified <HiBadgeCheck size={24} color="green" />
              </div>
              <button
                className={`px-6 py-2 ${provider?.status === 'active' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                  } text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200`}
                onClick={() => resetActivation(provider?.status === 'active' ? 'inactive' : 'active')}
              >
                {provider?.status === 'active' ? 'Suspend' : 'Activate'}
              </button>
            </div>
          ) : (
            <div className="flex space-x-3">
              <button onClick={() => acceptProvider(true)} className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                Verify
              </button>
              {/* <button onClick={() => acceptProvider(false)} className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                Reject
              </button> */}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="rounded-lg p-6 border-2 p-4 rounded-md shadow">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed">{provider.description || 'N/A'}</p>
            </div>

            {/* Driver Information */}
            <div className="rounded-lg p-6 border-2 p-4 rounded-md shadow">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Driver Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column Info */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FaBuilding className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Company Name</p>
                      <p className="text-sm text-gray-600">{provider.companyName || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Email address</p>
                      <p className="text-sm text-gray-600">{provider.email || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaPhone className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Phone Number</p>
                      <p className="text-sm text-gray-600">{provider.phone || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaTruck className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Type of tow truck</p>
                      <p className="text-sm text-gray-600">{provider.towTypeId?.name || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaMapMarkerAlt className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Address</p>
                      <p className="text-sm text-gray-600">{provider.address || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column Info */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FaCalendarAlt className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Date of birth</p>
                      <p className="text-sm text-gray-600">{provider.dateOfBirth || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaVenusMars className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Gender</p>
                      <p className="text-sm text-gray-600 uppercase">{provider.gender || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaIdCard className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">National ID No</p>
                      <p className="text-sm text-gray-600">{provider.nidNo || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaIdCard className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Driving License No</p>
                      <p className="text-sm text-gray-600">{provider.drivingLicenseNo || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaCar className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Car Number plate No</p>
                      <p className="text-sm text-gray-600">{provider.carRegistrationNo || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Documents */}
          <div className="rounded-lg p-6 border-2 p-4 rounded-md shadow">
            <h2 className="text-lg font-semibold text-gray-800">All Document</h2>
            <hr className='my-2 border' />

            <div className="space-y-6">
              {/* NID/Tax ID */}
              <div>
                <h3 className="text-sm font-medium text-gray-800 mb-3">NID/Tax ID</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="aspect-[3/2] bg-gray-100 rounded-lg overflow-hidden">
                    <img  onClick={() => showModal(provider?.nidFront)} src={`${import.meta.env.VITE_IMAGE_URL}/` + provider?.nidFront} alt="NID Document" className="w-full h-full object-cover" />
                  </div>
                  <div className="aspect-[3/2] bg-gray-100 rounded-lg overflow-hidden">
                    <img  onClick={() => showModal(provider?.nidBack)} src={`${import.meta.env.VITE_IMAGE_URL}/` + provider?.nidBack} alt="Tax ID Document" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              {/* Driving License */}
              <div>
                <h3 className="text-sm font-medium text-gray-800 mb-3">Driving License</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="aspect-[3/2] bg-gray-100 rounded-lg overflow-hidden">
                    <img  onClick={() => showModal(provider?.drivingLicenseFront)} src={`${import.meta.env.VITE_IMAGE_URL}/` + provider?.drivingLicenseFront} alt="Driving License Front" className="w-full h-full object-cover" />
                  </div>
                  <div className="aspect-[3/2] bg-gray-100 rounded-lg overflow-hidden">
                    <img  onClick={() => showModal(provider?.drivingLicenseBack)} src={`${import.meta.env.VITE_IMAGE_URL}/` + provider?.drivingLicenseBack} alt="Driving License Front" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              {/* Car Registration */}
              <div>
                <h3 className="text-sm font-medium text-gray-800 mb-3">Car Registration</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="aspect-[3/2] bg-gray-100 rounded-lg overflow-hidden">
                    <img  onClick={() => showModal(provider?.carRegistrationFront)} src={`${import.meta.env.VITE_IMAGE_URL}/` + provider?.carRegistrationFront} alt="Car Registration Front" className="w-full h-full object-cover" />
                  </div>
                  <div className="aspect-[3/2] bg-gray-100 rounded-lg overflow-hidden">
                    <img  onClick={() => showModal(provider?.carRegistrationBack)} src={`${import.meta.env.VITE_IMAGE_URL}/` + provider?.carRegistrationBack} alt="Car Registration Front" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              {/* Driver & Car Picture */}
              <div>
                <h3 className="text-sm font-medium text-gray-800 mb-3">Driver & Car Picture</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="aspect-[3/2] bg-gray-100 rounded-lg overflow-hidden">
                    <img  onClick={() => showModal(provider?.driverImage)} src={`${import.meta.env.VITE_IMAGE_URL}/` + provider?.driverImage} alt="Driver Picture" className="w-full h-full object-cover" />
                  </div>
                  <div className="aspect-[3/2] bg-gray-100 rounded-lg overflow-hidden">
                    <img  onClick={() => showModal(provider?.carImage)} src={`${import.meta.env.VITE_IMAGE_URL}/` + provider?.carImage} alt="Car Picture" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DashboardModal setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} width={'900px'} maxWidth='90%'>
        <div className="w-full flex justify-center items-center bg-black rounded-lg">
          <img
            src={`${import.meta.env.VITE_IMAGE_URL}/` + modalData}
            alt="Enlarged"
            className="w-full max-h-[80vh] object-contain rounded"
          />
        </div>
      </DashboardModal>

    </div>
  );
};

export default ProviderDetails;
