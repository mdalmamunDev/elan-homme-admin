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
import { FaArrowCircleDown, FaUserTie } from "react-icons/fa";
import {
  MdOutlineSecurityUpdateWarning,
} from "react-icons/md";
import { FaDollarSign, FaMoneyBill, FaRegNewspaper, FaServicestack, FaUserShield } from "react-icons/fa6";
import { BiMessageSquareDetail } from "react-icons/bi";
import Earnings from "../pages/Main/Earnings/Earnings";
import GeneralSettings from "../pages/Settings/GeneralSettings";
import Admins from "../pages/Main/Users/Admins";
import Magazines from "../pages/Main/Magazines/Magazines";

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
    name: "Magazine",
    path: "/magazine",
    icon: FaRegNewspaper,
    element: <Magazines />,
  },
  {
    name: "Users",
    path: "/user",
    icon: CiUser,
    element: <Users />,
  },
  {
    name: "Admins",
    path: "/admin",
    icon: FaUserTie,
    element: <Admins />,
  },
  {
    name: "Payments",
    path: "earnings",
    icon: FaDollarSign,
    element: <Earnings />,
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
      // {
      //   name: "General Settings",
      //   icon: RiListSettingsLine,
      //   path: "settings/generals",
      //   element: <GeneralSettings />,
      // },
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
      // {
      //   name: "About Us",
      //   icon: BiMessageSquareDetail,
      //   path: "settings/about-us",
      //   element: <AboutUs />,
      // },
      {
        path: "settings/about-us/edit",
        element: <EditAboutUs />,
      },
    ],
  },
];
