import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import PageHeading from "../../Components/PageHeading";
import { useGetSettingQuery } from "../../redux/features/settings/settingApi";
import LoaderWraperComp from "../../Components/LoaderWraperComp";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetSettingQuery("privacy-policy");

  return (
    <div className="min-h-[70vh] flex flex-col justify-between">
      <div className="space-y-4">
        <div className="p-2 flex justify-between items-center bg-4">
          <PageHeading title="Privacy Policy" disbaledBackBtn={true} />
        </div>
        <div className="w-full h-[70vh] overflow-auto bg-5 rounded-md border px-2">
          <LoaderWraperComp isError={isError} isLoading={isLoading}>
            <div
              className="no-tailwind"
              style={{ padding: "30px 25px" }}
              dangerouslySetInnerHTML={{ __html: data?.data?.value }}
            ></div>
          </LoaderWraperComp>
        </div>
        <div className="flex justify-end pt-5">
          <Button
            onClick={() => navigate("edit")}
            size="large"
            htmlType="submit"
            type="primary"
            className="px-8 w-[250px]"
          >
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
