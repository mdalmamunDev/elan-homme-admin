import { Button } from "antd";
import Form from "antd/es/form/Form";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OTPInput from "react-otp-input";
import Swal from "sweetalert2";
import bg from "../../assets/images/bg-verify-email.svg";
import {
  useVerifyEmailMutation,
  useLazyResendOTPQuery,
} from "../../redux/features/Auth/authApi";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);

  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [triggerResendOTP, { isLoading: resendLoading }] = useLazyResendOTPQuery();

  // Use state for otpExpire so that UI reacts to changes
  const [otpExpire, setOtpExpire] = useState(() => {
    const storedExpire = sessionStorage.getItem("otpExpire");
    return storedExpire ? parseInt(storedExpire, 10) : Date.now() + 60 * 1000;
  });

  // Timer effect
  useEffect(() => {
    sessionStorage.setItem("otpExpire", otpExpire.toString());

    const updateTimer = () => {
      const remaining = Math.floor((otpExpire - Date.now()) / 1000);
      if (remaining <= 0) {
        setTimer(0);
        sessionStorage.removeItem("otpExpire");
      } else {
        setTimer(remaining);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [otpExpire]);

  // Handle Resend OTP
  const handleResend = async () => {
    try {
      const token = sessionStorage.getItem("resend-token");
      if (!token) {
        throw new Error("Resend token not found. Please try again later.");
      }

      const res = await triggerResendOTP({ token }).unwrap();

      if (res?.data?.resetPasswordToken) {
        sessionStorage.setItem("resend-token", res.data.resetPasswordToken);
      }

      Swal.fire({
        icon: "success",
        title: "OTP Resent!",
        timer: 1000,
        showConfirmButton: false,
      });

      const newExpire = Date.now() + 60 * 1000;
      setOtpExpire(newExpire); // Update expiration and reset timer

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to resend OTP",
        text:
          (error.message ||
            error?.data?.message ||
            "Something went wrong.") +
          " Please try again later.",
      });
    }
  };

  // Submit OTP
  const onFinish = async () => {
    try {
      // if (isNaN(otp) || otp.length < 6) {
      //   throw new Error("Please enter a valid 6-digit OTP!");
      // }

      // const token = sessionStorage.getItem("resend-token");
      // const response = await verifyEmail({ id, otp, token }).unwrap();

      // sessionStorage.setItem(
      //   "verify-token",
      //   JSON.stringify({ token: response?.data, email: id })
      // );

      navigate(`/auth/reset-password`);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed!!",
        text: (error.message || error?.data?.message || "Something went wrong.")});
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
              <h3 className="font-bold text-2xl text-s-2">Verify Email</h3>
              <p className="text-light-gray">Please enter your OTP.</p>
            </div>
            <Form
              name="verify_email"
              layout="vertical"
              requiredMark={false}
              onFinish={onFinish}
              className="space-y-[24px]"
            >
              <div className="py-3 text-2xl font-semibold flex justify-center">
                <OTPInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  inputStyle={{
                    height: "60px",
                    width: "50px",
                    margin: "0 10px",
                    borderRadius: "15px",          // Circular shape
                    border: "2px solid #f59effff",  // Blue border
                    boxShadow: "0 4px 10px rgb(93 158 158 / 0.5)", // Blue glow shadow
                    fontSize: "30px",
                    textAlign: "center",
                    outline: "none",
                    backgroundColor: "white",
                    color: "#d44af0ff",
                  }}
                  renderSeparator={<span> </span>}
                  renderInput={(props) => <input {...props} />}
                />
              </div>
              <div className="flex justify-center items-center">
                {timer > 0 ? (
                  <span className="text-lg text-red-700">
                    Resend OTP in {timer} second{timer > 1 && "s"}
                  </span>
                ) : (
                  <Button type="link" onClick={handleResend} loading={resendLoading}>
                    Resend OTP
                  </Button>
                )}
              </div>
              <Form.Item>
                <Button
                  size="large"
                  htmlType="submit"
                  className="w-full bg-s-2 text-white rounded-md"
                  loading={isLoading}
                >
                  Verify
                </Button>

                <p className="text-center mt-1 text-s-2">
                  Please enter the OTP we have sent to your email.
                </p>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
