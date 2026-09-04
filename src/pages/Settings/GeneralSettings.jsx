import { Button, Form, Input, InputNumber } from "antd";
import { useNavigate } from "react-router-dom";
import PageHeading from "../../Components/PageHeading";
import { useGetSettingGeneralsQuery, useUpdateSettingGeneralsMutation } from "../../redux/features/settings/settingApi";
import LoaderWraperComp from "../../Components/LoaderWraperComp";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const GeneralSettings = () => {
  const [updateSettingGenerals] = useUpdateSettingGeneralsMutation();
  const { data, isLoading, isError } = useGetSettingGeneralsQuery();
  const settings = data?.data || [];

  // Helper to find setting value by key
  const getSettingValue = (key) => {
    const setting = settings.find((s) => s.key === key);
    return setting ? setting.value : undefined;
  };

  const onFinish = async (values) => {
    try {
      await updateSettingGenerals({ payload: values }).unwrap();
      toast.success("Settings updated successfully");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed!!",
        text: error?.data?.message || "Something went wrong!",
      });
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col justify-between">
      <div className="space-y-4">
        <div className="p-2 flex justify-between items-center bg-4">
          <PageHeading title="General Settings" disbaledBackBtn={true} />
        </div>

        <LoaderWraperComp isError={isError} isLoading={isLoading}>
          <Form
            layout="vertical"
            onFinish={onFinish}
            className="space-y-6 max-w-4xl mx-auto"
            name="general_settings_form"
          >
            <h2 className="text-xl font-semibold">General Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* commission-rate */}
              <Form.Item
                label="Commission Rate"
                name="commission-rate"
                className="w-full"
                initialValue={getSettingValue("commission-rate")}
                rules={[{ required: true, message: "Please enter commission rate" }]}
                min={0}
                max={100}
              >
                <InputNumber min={0} max={100} className="w-full" />
              </Form.Item>

              {/* transaction-transfer-hours */}
              <Form.Item
                label="Auto Transaction Transfer (Hours)"
                name="transaction-transfer-hours"
                className="w-full"
                initialValue={getSettingValue("transaction-transfer-hours")}
                rules={[{ required: true, message: "Please enter transaction transfer hours" }]}
                min={0}
              >
                <InputNumber min={0} className="w-full" />
              </Form.Item>

              {/* transport-price */}
              <Form.Item
                label="Transport Price"
                name="transport-price"
                className="w-full"
                initialValue={getSettingValue("transport-price")}
                rules={[{ required: true, message: "Please enter transport price" }]}
                min={0}
              >
                <InputNumber min={0} className="w-full" />
              </Form.Item>
            </div>

            {/* radius-limits */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Radius Limits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  label="Min"
                  name={["radius-limits", "min"]}
                  initialValue={getSettingValue("radius-limits")?.min}
                  rules={[{ required: true, message: "Please enter min radius" }]}
                >
                  <InputNumber min={0} className="w-full" />
                </Form.Item>
                <Form.Item
                  label="Max"
                  name={["radius-limits", "max"]}
                  initialValue={getSettingValue("radius-limits")?.max}
                  rules={[{ required: true, message: "Please enter max radius" }]}
                >
                  <InputNumber min={0} className="w-full" />
                </Form.Item>
              </div>
            </div>

            {/* support */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Support</h2>
              <Form.Item
                label="Details"
                name={["support", "details"]}
                initialValue={getSettingValue("support")?.details}
                rules={[{ required: true, message: "Please enter support details" }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
              <Form.Item
                label="Phone"
                name={["support", "phone"]}
                initialValue={getSettingValue("support")?.phone}
                rules={[
                  { required: true, message: "Please enter support phone" },
                  {
                    pattern: /^\+?[0-9\s\-]{7,20}$/,
                    message: "Please enter a valid phone number (e.g., +1234567890)"
                  }
                ]}
              >
                <Input type="tel" />
              </Form.Item>
              <Form.Item
                label="Email"
                name={["support", "email"]}
                initialValue={getSettingValue("support")?.email}
                rules={[
                  { required: true, message: "Please enter support email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input />
              </Form.Item>
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">
                Save All Settings
              </Button>
            </Form.Item>
          </Form>
        </LoaderWraperComp>
      </div>
    </div>
  );
};

export default GeneralSettings;
