import { Button, Input } from "antd";
import Form from "antd/es/form/Form";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "../../redux/features/Auth/authApi";
import Swal from "sweetalert2";
import { MailOutlined } from "@ant-design/icons";
import bg from "../../assets/images/bg-forgot-pass.svg";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const onFinish = async (values) => {
    try {
      // Execute the forgot password API call.
      // const response = await forgotPassword(values).unwrap();
      // Save the token from the response to session storage for resend OTP functionality.
      // sessionStorage.setItem("resend-token", response?.data?.resetPasswordToken);
      navigate(`/auth/verify-email/${values.email}`);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed!!",
        text: (error.message || error?.data?.message || "Something went wrong.") + " Please try again later."
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
    <div className="sm:w-1/2 flex justify-center items-center">
      <div className="rounded-[16px] max-w-2xl w-full border-2 shadow">
        <div className="w-full px-14 py-[80px]">
          <div className="pb-6 text-center space-y-2">
            <h3 className="font-bold text-2xl text-s-2">Forgot Password</h3>
            <p className="">
              Please enter your email address to reset
              <br></br>your password.
            </p>
          </div>
          <Form
            name="normal_login"
            layout="vertical"
            requiredMark={false}
            initialValues={{}}
            onFinish={onFinish}
            className="space-y-[24px]"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-s-2 me-3" />}
                placeholder="Enter Your Email"
                size="large"
                className="rounded-md border border-stone-600 focus:border-stone-700 text-black"
              />
            </Form.Item>
            <Form.Item>
              <Button
                size="large"
                htmlType="submit"
                className="w-full bg-s-2 text-white rounded-md"
                loading={isLoading}
              >
                Send OTP
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
    </>
  );
};

export default ForgotPassword;
