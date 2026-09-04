import React from "react";
import { Button } from "antd";
import dashProfile from "../../assets/images/guest-status.png";
import { FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import PageHeading from "../../Components/PageHeading";
import PasswordChangeModalForm from "../../Components/User/PasswordChangeModalForm";
import { useGetUserByTokenQuery } from "../../redux/features/Auth/authApi";
import PhoneCountryInput from "../../Components/PhoneCountryInput";
import LoaderWraperComp from "../../Components/LoaderWraperComp";

const MyProfile = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Automatically sends the token in the header and forces a refetch on mount
  const { data, error, isLoading } = useGetUserByTokenQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });


  // Fallback values for missing fields (show "N/A")
  const user = {
    name: data?.data?.name || "N/A",
    email: data?.data?.email || "N/A",
    phone: data?.data?.phone || "N/A",
    role: data?.data?.role || "N/A",
    profileImage: data?.data?.profileImage || null,
    address: data?.data?.address || "N/A",
  };

  return (
    <div className="space-y-[24px] bg-light-gray rounded-2xl border-2 border-[#5680C0] py-10">
      <LoaderWraperComp isError={error} isLoading={isLoading}>

        <div className="p-4 px-10 flex justify-between items-center border-b-2 border-[#5680C0]">
          <PageHeading title="Personal Information" disbaledBackBtn={true} />
        </div>
        <div className="w-full">
          <div className="py-4 px-8 flex justify-end items-center">
            <Button
              onClick={() => setIsModalOpen(true)}
              size="large"
              type="default"
              className="px-8"
            >
              Change Password
            </Button>
          </div>
          <div className="w-full grid grid-cols-12 gap-x-10 px-14 py-8">
            {/* Left column: Profile image and edit button */}
            <div className="col-span-3 space-y-6">
              <div className="min-h-[365px] flex flex-col items-center justify-center p-8 rounded-lg border border-[#5680C0] shadow-inner space-y-4">
                <div className="my-3">
                  <img
                    src={
                      user?.profileImage
                        ? `${import.meta.env.VITE_IMAGE_URL}/${user.profileImage}`
                        : dashProfile
                    }
                    alt="Profile"
                    className="h-[144px] w-[144px] rounded-full object-cover border border-[#5680C0]"
                  />
                </div>
                <h5 className="text-lg text-[#222222]">Profile</h5>
                <h4 className="text-2xl text-[#222222]">
                  {user.name}
                </h4>
              </div>
              <Button
                onClick={() => navigate("/settings/profile/edit")}
                size="large"
                type="primary"
                className="px-8 w-full"
              >
                <FiEdit /> Edit Profile
              </Button>
            </div>
            {/* Right column: Display user details */}
            <div className="col-span-9 space-y-[24px]">
              <div className="space-y-4">
                <div>
                  <p className="text-lg  font-medium mb-1">
                    Name
                  </p>
                  <div className="h-[56px] rounded-lg bg-[#f0f1f8] border border-[#5680C0] flex items-center px-4">
                    {user.name}
                  </div>
                </div>
                <div>
                  <p className="text-lg  font-medium mb-1">
                    Email
                  </p>
                  <div className="h-[56px] rounded-lg bg-[#f0f1f8] border border-[#5680C0] flex items-center px-4">
                    {user.email}
                  </div>
                </div>
                <div>
                  <p className="text-lg text-[#222222] font-medium mb-1">
                    Phone Number
                  </p>
                  <PhoneCountryInput disabled={true} phoneNumber={user.phone} />
                  {/* <div className="h-[56px] rounded-lg bg-[#f0f1f8] border border-[#5680C0] flex items-center px-4">
                  {user.phone}
                </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <PasswordChangeModalForm
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </LoaderWraperComp>
    </div>
  );
};

export default MyProfile;

