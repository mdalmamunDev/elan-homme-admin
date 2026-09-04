import { Button } from "antd";
import React from "react";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";

const AddNewButton = ({ text, path, className }) => {
  const navigate = useNavigate();
  return (
    <div className={cn("flex justify-end", className)}>
      <Button
        onClick={() => navigate(path ? path : "add-new")}
        className="rounded-full px-8"
      >
        <FiPlus /> {text || "Add New"}
      </Button>
    </div>
  );
};

export default AddNewButton;
