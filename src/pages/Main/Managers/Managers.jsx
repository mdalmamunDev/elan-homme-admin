import React, { useState, useMemo } from "react";
import { Button, DatePicker, Input } from "antd";
import { IoSearch } from "react-icons/io5";
import { useGetAllUserQuery } from "../../../redux/features/Users/usersApi";
import PageHeading from "../../../Components/PageHeading";
import ManagerListTable from "../../../Components/ManagerListTable";

const Managers = () => {
  // State for search filters: name, email, and date
  const [searchQuery, setSearchQuery] = useState({ name: "", email: "", date: "" });
  // Two tabs: "All Managers" shows only approved records and "Pending Managers" shows only pending records.
  // Use "approve" for approved and "send" for pending.
  const [managerStatus, setManagerStatus] = useState("approve");

  // Fetch all managers with a high limit
  const { data, isLoading, isError } = useGetAllUserQuery({
    role: "manager",
    limit: 2000,
  });
  const allManagers = data?.data || [];

  // Filter full list based on name, email, and date.
  const filteredManagers = useMemo(() => {
    return allManagers.filter((manager) => {
      const matchesName = searchQuery.name
        ? manager.name?.toLowerCase().includes(searchQuery.name.toLowerCase())
        : true;
      const matchesEmail = searchQuery.email
        ? manager.email?.toLowerCase().includes(searchQuery.email.toLowerCase())
        : true;
      const managerDate = new Date(manager.createdAt).toISOString().slice(0, 10);
      const matchesDate = searchQuery.date ? managerDate === searchQuery.date : true;
      return matchesName && matchesEmail && matchesDate;
    });
  }, [allManagers, searchQuery]);

  // Filter based on the selected tab:
  // "approve" tab shows only managers whose managerInfo.isRequest equals "approve"
  // "send" tab shows only managers whose managerInfo.isRequest equals "send"
  const displayedManagers =
    managerStatus === "send"
      ? filteredManagers.filter(
          (m) => (m.managerInfo?.isRequest ?? "").toLowerCase() === "send"
        )
      : filteredManagers.filter(
          (m) => (m.managerInfo?.isRequest ?? "").toLowerCase() === "approve"
        );

  if (isLoading) return <div>Loading managers...</div>;
  if (isError) return <div>Error loading managers.</div>;

  return (
    <div className="py-[16px]">
      {/* Heading and search controls */}
      <div className="pb-5 flex justify-between items-center">
        <PageHeading title={"Manager List"} />
        <div className="flex justify-end gap-x-4">
          <DatePicker
            format="YYYY-MM-DD"
            onChange={(date, dateString) =>
              setSearchQuery((prev) => ({ ...prev, date: dateString }))
            }
            placeholder="Date"
            style={{ width: "150px" }}
          />
          <Input
            onChange={(e) =>
              setSearchQuery((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Manager Name"
            style={{ width: "170px" }}
          />
          <Input
            onChange={(e) =>
              setSearchQuery((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="Email"
            style={{ width: "170px" }}
          />
          <Button
            onClick={() => console.log("Search query:", searchQuery)}
            type="primary"
            shape="circle"
            icon={<IoSearch />}
          />
        </div>
      </div>
      {/* Toggle between All Managers and Pending Managers */}
      <div className="flex justify-start divide-x pt-2">
        {[
          { label: "All Managers", value: "approve" },
          { label: "Pending Managers", value: "send" },
        ].map((item) => (
          <button
            key={item.value}
            onClick={() => setManagerStatus(item.value)}
            className={`text-lg font-medium px-4 border-b-4 border-gray-100 hover:bg-slate-100 inline-block py-2 transition-all ${
              managerStatus === item.value ? "bg-slate-200" : ""
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <ManagerListTable
        role="manager"
        managerStatus={managerStatus}
        data={displayedManagers}
        pageSize={10}
      />
    </div>
  );
};

export default Managers;
