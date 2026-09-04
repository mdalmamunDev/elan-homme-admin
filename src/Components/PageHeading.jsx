import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import { FaAngleLeft } from "react-icons/fa6";

const PageHeading = ({ title, backPath, disbaledBackBtn, className, icon }) => {
  const navigate = useNavigate();
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {!disbaledBackBtn && (
        <button
          className="outline-none px-1"
          onClick={() => navigate(backPath || -1)}
        >
          {icon || <FaAngleLeft size={20} />}
        </button>
      )}
      {!!title && <h1 className="text-2xl font-medium">{title}</h1>}
    </div>
  );
};

export default PageHeading;
