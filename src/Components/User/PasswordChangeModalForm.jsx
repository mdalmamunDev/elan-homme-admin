// import { Button, Form, Input, Modal } from "antd";
// import React from "react";
// import { LiaArrowLeftSolid } from "react-icons/lia";
// import { MdLockOutline } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import { useChangePasswordByOldPassMutation } from "../../redux/features/Auth/authApi";

// const PasswordChangeModalForm = ({ isModalOpen, setIsModalOpen }) => {
//   const navigate = useNavigate();
//   const [form] = Form.useForm();
//   const [mutation, { isLoading }] = useChangePasswordByOldPassMutation();
//   const handleChangePassword = async (values) => {
//     try {
//       const response = await mutation(values).unwrap();
//       form.resetFields();
//       setIsModalOpen(false);
//       Swal.fire({
//         icon: "success",
//         title: response?.message,
//         showConfirmButton: false,
//         timer: 1000,
//       });
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Failed !!",
//         text:
//           (error.message || error?.data?.message || "Something went wrong.") +
//           " Please try again later.",
//       });
//     }
//   };
//   return (
//     <Modal
//       title={null}
//       open={isModalOpen}
//       closeIcon={null}
//       onOk={() => setIsModalOpen(false)}
//       onCancel={() => setIsModalOpen(false)}
//       style={{
//         maxWidth: 441,
//       }}
//       footer={[]}
//     >
//       <div className="px-[24px] pb-[14px]">
//         <div className="flex items-center gap-1.5 pt-[34px]">
//           <button
//             onClick={() => setIsModalOpen(false)}
//             className="outline-none"
//           >
//             <LiaArrowLeftSolid size={26} />
//           </button>
//           <h6 className="text-2xl">Change Password</h6>
//         </div>
//         <p className="text-[16px] my-[24px]">
//           Your password must be 8-10 character long.
//         </p>
//         <Form
//           name="dependencies"
//           autoComplete="off"
//           requiredMark={false}
//           layout="vertical"
//           onFinish={handleChangePassword}
//         >
//           <Form.Item
//             label={<p className="pb-1 text-gray-600">Enter old password</p>}
//             name="oldPassword"
//             rules={[
//               {
//                 required: true,
//                 message: "Please Input Your Password!",
//               },
//             ]}
//           >
//             <Input.Password
//               prefix={<MdLockOutline className="mr-2" />}
//               style={{
//                 backgroundColor: "#E9F4F3",
//               }}
//               className="p-4 rounded-lg h-[56px]  placeholder:text-[#999999]"
//               placeholder="Enter old Password"
//             />
//           </Form.Item>
//           <Form.Item
//             label={<p className="pb-1 text-gray-600">Enter new password</p>}
//             name="newPassword"
//             rules={[
//               {
//                 required: true,
//                 message: "Please Input Your Password!",
//               },
//             ]}
//           >
//             <Input.Password
//               prefix={<MdLockOutline className="mr-2" />}
//               style={{
//                 backgroundColor: "#E9F4F3",
//               }}
//               className="rounded-lg h-[56px]  placeholder:text-[#999999]"
//               placeholder="Set new password"
//             />
//           </Form.Item>
//           <Form.Item
//             label={<p className="pb-1 text-gray-600">Re-enter new password</p>}
//             name="confirmPassword"
//             dependencies={["newPassword"]}
//             rules={[
//               {
//                 required: true,
//                 message: "Please Input Your Password!",
//               },
//               ({ getFieldValue }) => ({
//                 validator(_, value) {
//                   if (!value || getFieldValue("newPassword") === value) {
//                     return Promise.resolve();
//                   }
//                   return Promise.reject(
//                     new Error("The new password that you entered do not match!")
//                   );
//                 },
//               }),
//             ]}
//           >
//             <Input.Password
//               prefix={<MdLockOutline className="mr-2" />}
//               style={{
//                 backgroundColor: "#E9F4F3",
//               }}
//               className="p-4 rounded-lg h-[56px]  placeholder:text-[#999999]"
//               placeholder="Re-enter your password"
//             />
//           </Form.Item>
//           <Button
//             type="link"
//             className="text-[16px] -mt-3 mb-3 outline-none px-0 !text-black"
//             // onClick={() => setModalTitle("Forget Password")}
//             onClick={() => navigate("/auth/forgot-password")}
//           >
//             Forget Password?
//           </Button>
//           <Form.Item>
//             <Button
//               loading={isLoading}
//               size="large"
//               type="primary"
//               htmlType="submit"
//               className="w-full"
//             >
//               Update Password
//             </Button>
//           </Form.Item>
//         </Form>
//         <div />
//       </div>
//     </Modal>
//   );
// };

// export default PasswordChangeModalForm;
import { Button, Form, Input, Modal } from "antd";
import React from "react";
import { LiaArrowLeftSolid } from "react-icons/lia";
import { MdLockOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useChangePasswordByOldPassMutation } from "../../redux/features/Auth/authApi";

const PasswordChangeModalForm = ({ isModalOpen, setIsModalOpen }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [changePassword, { isLoading }] = useChangePasswordByOldPassMutation();

  const handleChangePassword = async (values) => {
    // Extract only oldPassword and newPassword; confirmPassword is only for validation.
    const { oldPassword, newPassword } = values;
    try {
      const response = await changePassword(values).unwrap();
      form.resetFields();
      setIsModalOpen(false);
      Swal.fire({
        icon: "success",
        title: response?.message,
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed !!",
        text:
          (error.message || error?.data?.message || "Something went wrong.") +
          " Please try again later.",
      });
    }
  };

  return (
    <Modal
      title={null}
      open={isModalOpen}
      closeIcon={null}
      onOk={() => setIsModalOpen(false)}
      onCancel={() => setIsModalOpen(false)}
      style={{ maxWidth: 441 }}
      footer={[]}
    >
      <div className="px-[24px] pb-[14px]">
        <div className="flex items-center gap-1.5 pt-[34px]">
          <button onClick={() => setIsModalOpen(false)} className="outline-none">
            <LiaArrowLeftSolid size={26} />
          </button>
          <h6 className="text-2xl">Change Password</h6>
        </div>
        <p className="text-[16px] my-[24px]">
          Your password must be 8-10 characters long.
        </p>
        <Form
          name="changePassword"
          form={form}
          autoComplete="off"
          requiredMark={false}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            label={<p className="pb-1 text-gray-600">Enter old password</p>}
            name="currentPassword"
            rules={[
              {
                required: true,
                message: "Please input your current password!",
              },
            ]}
          >
            <Input.Password
              prefix={<MdLockOutline className="mr-2" />}
              style={{ backgroundColor: "#E9F4F3" }}
              className="p-4 rounded-lg h-[56px] placeholder:text-[#999999]"
              placeholder="Enter old password"
            />
          </Form.Item>
          <Form.Item
            label={<p className="pb-1 text-gray-600">Enter new password</p>}
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your new password!",
              },
            ]}
          >
            <Input.Password
              prefix={<MdLockOutline className="mr-2" />}
              style={{ backgroundColor: "#E9F4F3" }}
              className="rounded-lg h-[56px] placeholder:text-[#999999]"
              placeholder="Set new password"
            />
          </Form.Item>
          <Form.Item
            label={<p className="pb-1 text-gray-600">Re-enter new password</p>}
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Please confirm your new password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The new password that you entered do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<MdLockOutline className="mr-2" />}
              style={{ backgroundColor: "#E9F4F3" }}
              className="p-4 rounded-lg h-[56px] placeholder:text-[#999999]"
              placeholder="Re-enter new password"
            />
          </Form.Item>
          <Button
            type="link"
            className="text-[16px] -mt-3 mb-3 outline-none px-0 !text-black"
            onClick={() => navigate("/auth/forgot-password")}
          >
            Forget Password?
          </Button>
          <Form.Item>
            <Button
              loading={isLoading}
              size="large"
              type="primary"
              htmlType="submit"
              className="w-full"
            >
              Update Password
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default PasswordChangeModalForm;
