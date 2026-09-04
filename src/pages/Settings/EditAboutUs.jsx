import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import PageHeading from "../../Components/PageHeading";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import {
  useGetSettingQuery,
  useUpdateSettingsMutation,
} from "../../redux/features/settings/settingApi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import LoaderWraperComp from "../../Components/LoaderWraperComp";

const EditAboutUs = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const { data, isLoading, isError } = useGetSettingQuery("about-us");
  const [updateSettings, { isLoading: muLoading }] = useUpdateSettingsMutation();

  const handleUpdate = async () => {
    try {
      await updateSettings({
        url: "about-us",
        body: { value: content },
      }).unwrap();
      navigate(-1);
      toast.success("About updated successfully", {
        position: "top-center",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error...",
        text:
          error?.data?.message || error?.message || "Something went wrong!!",

      });
    }
  };

  useEffect(() => {
    if (data?.data?.value) {
      setContent(data.data.value);
    }
  }, [data]);

  return (
    <div className="min-h-[75vh] flex flex-col justify-between gap-6">
      <div className="space-y-6">
        <div className="p-2 flex justify-between items-center bg-4">
          <PageHeading title={"Edit About Us"} />
        </div>
        <LoaderWraperComp isLoading={isLoading} isError={isError}>
          <div className="h-full">
            <ReactQuill
              placeholder="Enter your update about us..."
              theme="snow"
              value={content}
              onChange={(value) => setContent(value)}
              className="h-[50vh]"
            />
          </div>
        </LoaderWraperComp>
      </div>
      <div className="flex justify-end">
        <Button
          onClick={handleUpdate}
          loading={muLoading}
          size="large"
          type="primary"
          htmlType="submit"
          className="px-8 w-[250px]"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default EditAboutUs;
