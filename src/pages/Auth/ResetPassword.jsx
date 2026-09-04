import { Button, Input } from "antd";
import Form from "antd/es/form/Form";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "../../redux/features/Auth/authApi";
import Swal from "sweetalert2";
import { EyeTwoTone, EyeInvisibleOutlined, KeyOutlined } from "@ant-design/icons";
import bg from "../../assets/images/bg-reset-pass.svg";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const onFinish = async (values) => {
    try {
      // const { token, email } = JSON.parse(
      //   sessionStorage.getItem("resend-token")
      // );
      // const token = sessionStorage.getItem("resend-token")
      // Call the API endpoint "/auth/reset-password"
      // await resetPassword({
      //   // id: email,
      //   token,
      //   data: values,
      // }).unwrap();

      Swal.fire({
        icon: "success",
        title: "Password Updated!!",
        showConfirmButton: false,
        timer: 1000,
      });

      // sessionStorage.removeItem("verify-token");
      navigate("/auth");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed !!",
        text:
          (error.message ||
            error?.data?.message ||
            "Something went wrong.") +
          " Please try again later.",
      });
    }
  };

  return (
    <>
    <div className="hidden sm:flex w-1/2 justify-center items-center border-e">
      <img
        src={bg}
        alt="description"
        className="max-h-full max-w-full object-cover"
      />
    </div>

    {/* Right half - outlet content */}
    <div className="sm:w-1/2 flex justify-center items-center">
      <div className="rounded-[16px] max-w-2xl w-full border-2 shadow">
        <div className="w-full px-14 py-[80px]">
          <div className="pb-6 text-center space-y-2">
            <h3 className="font-bold text-2xl text-s-2">Reset Password</h3>
            <p className="">
              Your password must be 8-10 character long.
            </p>
          </div>
          <Form
            name="reset_password"
            layout="vertical"
            initialValues={{
              remember: true,
            }}
            requiredMark={false}
            onFinish={onFinish}
          >
            <Form.Item
              name="password"
              className="text-base"
              rules={[
                {
                  required: true,
                  message: "Password is required!",
                },
              ]}
            >
              <Input.Password
                prefix={<KeyOutlined className="text-[#5D9E9E] me-3" />}
                placeholder="Enter password"
                className="rounded-md border border-stone-600 focus:border-stone-700 text-black"
                size="large"
                name="password"
                iconRender={(visible) =>
                  visible ? (
                    <EyeTwoTone style={{ color: "#5D9E9E" }} />
                  ) : (
                    <EyeInvisibleOutlined style={{ color: "#5D9E9E" }} />
                  )
                }
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              className="text-base"
              rules={[
                {
                  required: true,
                  message: "Password is required!",
                },
              ]}
            >
              <Input.Password
                prefix={<KeyOutlined className="text-[#5D9E9E] me-3" />}
                placeholder="Enter password"
                className="rounded-md border border-stone-600 focus:border-stone-700 text-black"
                size="large"
                name="password"
                iconRender={(visible) =>
                  visible ? (
                    <EyeTwoTone style={{ color: "#5D9E9E" }} />
                  ) : (
                    <EyeInvisibleOutlined style={{ color: "#5D9E9E" }} />
                  )
                }
              />
            </Form.Item>
            <div className="w-full flex justify-center pt-4">
              <Button
                loading={isLoading}
                size="large"
                htmlType="submit"
                className="w-full bg-s-2 text-white rounded-md"
              >
                Confirm
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  </>
  );
};

export default ResetPassword;

