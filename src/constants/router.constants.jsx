import { CiUser } from "react-icons/ci";
import { RiDashboardHorizontalFill, RiListSettingsLine, RiSettings5Fill } from "react-icons/ri";
import DashboardHome from "../pages/Main/DashboardHome/DashboardHome";
import Users from "../pages/Main/Users/Users";
import MyProfile from "../pages/Profile/MyProfile";
import EditMyProfile from "../pages/Profile/EditMyProfile";
import TermsConditions from "../pages/Settings/TermsConditions";
import EditTermsConditions from "../pages/Settings/EditTermsConditions";
import PrivacyPolicy from "../pages/Settings/PrivacyPolicy";
import EditPrivacyPolicy from "../pages/Settings/EditPrivacyPolicy";
import EditAboutUs from "../pages/Settings/EditAboutUs";
import AboutUs from "../pages/Settings/AboutUs";
import Notifications from "../pages/Main/Notifications/Notifications";
import { FaArrowCircleDown, FaArrowCircleUp, FaCar, FaUserTie } from "react-icons/fa";
import {
  MdOutlineSecurityUpdateWarning,
} from "react-icons/md";
import { FaDollarSign, FaMoneyBillTransfer, FaServicestack, FaTags, FaUserShield } from "react-icons/fa6";
import { BiMessageSquareDetail } from "react-icons/bi";
import TowTypes from "../pages/Main/TowTypes/TowTypes";
import Earnings from "../pages/Main/Earnings/Earnings";
import Withdraw from "../pages/Main/Earnings/Withdraw";
import GeneralSettings from "../pages/Settings/GeneralSettings";
import Transactions from "../pages/Main/Earnings/Transactions";
import RefundDetails from "../pages/Main/Earnings/RefundDetails";
import Providers from "../pages/Main/Users/Providers";
import Admins from "../pages/Main/Users/Admins";
import ProviderDetails from "../pages/Main/Users/ProviderDetails";
import Promos from "../pages/Main/PromoCodes/PromoCodes";
import Reports from "../pages/Main/Reports/Reports";

export const dashboardItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: RiDashboardHorizontalFill,
    element: <DashboardHome />,
  },
  {
    path: "notifications",
    element: <Notifications />,
  },
  {
    name: "Users",
    rootPath: "users",
    icon: RiSettings5Fill,
    children: [
      {
        name: "Users",
        path: "/user",
        icon: CiUser,
        element: <Users />,
      },
      {
        name: "Providers",
        path: "/provider",
        icon: FaCar,
        element: <Providers />,
      },
      {
        path: "/provider-details",
        element: <ProviderDetails />,
      },
      {
        name: "Admins",
        path: "/admin",
        icon: FaUserTie,
        element: <Admins />,
      },
    ],
  },
  {
    name: "Deposits",
    path: "earnings",
    icon: FaArrowCircleDown,
    element: <Earnings />,
  },
  {
    name: "Withdrawals",
    path: "withdraw",
    icon: FaArrowCircleUp,
    element: <Withdraw />,
  },
  {
    name: "Transactions",
    path: "transactions",
    icon: FaMoneyBillTransfer,
    element: <Transactions />,
  },
  {
    path: "refund-details/:id",
    element: <RefundDetails />,
  },
  {
    name: "Pricing",
    path: "pricing",
    icon: FaDollarSign,
    element: <TowTypes />,
  },
  // {
  //   name: "Promo Codes",
  //   path: "promo-codes",
  //   icon: FaTags,
  //   element: <Promos />,
  // },
  {
    name: "Reports",
    path: "service",
    icon: FaUserShield,
    element: <Reports />,
  },

  {
    name: "Settings",
    rootPath: "settings",
    icon: RiSettings5Fill,
    children: [
      {
        name: "Profile",
        path: "settings/profile",
        icon: CiUser,
        element: <MyProfile />,
      },
      {
        path: "settings/profile/edit",
        element: <EditMyProfile />,
      },
      {
        name: "General Settings",
        icon: RiListSettingsLine,
        path: "settings/generals",
        element: <GeneralSettings />,
      },
      {
        name: "Terms & Conditions",
        icon: FaServicestack,
        path: "settings/terms-conditions",
        element: <TermsConditions />,
      },
      {
        path: "settings/terms-conditions/edit",
        element: <EditTermsConditions />,
      },
      {
        name: "Privacy Policy",
        icon: MdOutlineSecurityUpdateWarning,
        path: "settings/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "settings/privacy-policy/edit",
        element: <EditPrivacyPolicy />,
      },
      {
        name: "About Us",
        icon: BiMessageSquareDetail,
        path: "settings/about-us",
        element: <AboutUs />,
      },
      {
        path: "settings/about-us/edit",
        element: <EditAboutUs />,
      },
    ],
  },
];
