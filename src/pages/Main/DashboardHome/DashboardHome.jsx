import React, { useState } from "react";
import EarningsChart from "../../../Components/EarningsChart";
import RecentUserTable from "../../../Components/RecentUserTable";
import { useGetDashboardQuery } from "../../../redux/features/Dashboard/dashboardApi";
import LoaderWraperComp from "../../../Components/LoaderWraperComp";
import driverIcon from "../../../assets/images/home-status-driver.svg"
import userIcon from "../../../assets/images/home-status-user.svg"
import appBalanceIcon from "../../../assets/images/home-status-app-balance.svg"
import earningIcon from "../../../assets/images/home-status-earnings.svg"
import RecentPromoTable from "../../../Components/RecentPromoTable";

const currentYear = new Date().getFullYear();

const DashboardHome = () => {
  // Year & Month selection state
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  // Single API call
  const { data: overallData, isLoading, isError } = useGetDashboardQuery({ recentLimit: 20, year: selectedYear, month: selectedMonth });

  const totalUsers = overallData?.data?.totalUsers ?? 0;
  const totalMagazines = overallData?.data?.totalMagazines ?? 0;
  const totalIssues = overallData?.data?.totalIssues ?? 0;
  const totalEarnings = overallData?.data?.earnings ?? 0;
  const earningChart = overallData?.data?.earningChart ?? [];
  const recentUsers = overallData?.data?.recentUsers ?? [];

  const homeStatus = [
    {
      title: "Earnings",
      amount: (
        <>
          {totalEarnings?.toFixed(2) || 0}${" "}
        </>
      ),
      icon: earningIcon,
      gradient: "from-[#2563EB] to-[#1E3A8A]", // Blue
    },
    {
      title: "Total Magazines",
      amount: totalMagazines || 0,
      icon: appBalanceIcon,
      gradient: "from-[#0891B2] to-[#164E63]", // Cyan
    },
    {
      title: "Recent Issues",
      amount: totalIssues || 0,
      icon: driverIcon,
      gradient: "from-[#6366F1] to-[#3730A3]", // Indigo
    },
    {
      title: "Total Users",
      amount: totalUsers || 0,
      icon: userIcon,
      gradient: "from-[#0F766E] to-[#134E4A]", // Teal
    },
  ];

  return (
    <div className="space-y-[24px]">
      {/* <LoaderWraperComp isError={isError} isLoading={isLoading}> */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          {/* Home status - show first on mobile, last on large screens */}
          <div className="col-span-2 xl:order-2 grid grid-cols-2 gap-2 text-white">
            {homeStatus.map((item, inx) => (
              <div
                key={inx}
                className={`grid grid-cols-4 gap-2 items-center rounded-2xl border border-[#5366FF33] bg-gradient-to-t ${item.gradient} w-full py-6 px-8 cursor-default`}
              >
                <div className="hidden 2xl:block col-span-1">
                  <img src={item.icon} alt="" />
                </div>
                <div className="col-span-3">
                  <h3 className="text-3xl font-bold">{item.amount}</h3>
                  <h3 className="text-md font-medium">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Chart - show second on mobile, first on large screens */}
          <div className="col-span-3 xl:order-1">
            <EarningsChart
              earningChart={earningChart}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              setSelectedYear={setSelectedYear}
              setSelectedMonth={setSelectedMonth}
            />
          </div>
        </div>


        <RecentUserTable users={recentUsers} />
      {/* </LoaderWraperComp> */}
    </div>
  );
};

export default DashboardHome;
