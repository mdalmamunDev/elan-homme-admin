// import React, { useEffect } from "react";
// import { FaAngleLeft } from "react-icons/fa";
// import { IoIosNotificationsOutline } from "react-icons/io";
// import { useNavigate } from "react-router-dom";
// import { useAdminNotificationQuery } from "../../../redux/features/Users/usersApi";
// import LoaderWraperComp from "../../../Components/LoaderWraperComp";
// import { cn } from "../../../lib/utils";
// import { compareByCTime } from "../../../utils/impFunction";
// import { useDispatch } from "react-redux";
// import { resetNotification } from "../../../redux/features/Auth/notificationSlice";
// import PageHeading from "../../../Components/PageHeading";

// const Notifications = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { data, isLoading, isError } = useAdminNotificationQuery(undefined);
//   useEffect(() => {
//     dispatch(resetNotification());
//   }, []);

//   const notification = [
//     {
//       msg: "Your account has been updated successfully.",
//       createdAt: "2024-02-01T10:15:30Z",
//       isReadable: false,
//     },
//     {
//       msg: "New feature added: Dark mode is now available!",
//       createdAt: "2024-01-30T08:00:00Z",
//       isReadable: true,
//     },
//     {
//       msg: "Reminder: Your subscription expires soon.",
//       createdAt: "2024-01-28T12:45:00Z",
//       isReadable: false,
//     },
//     {
//       msg: "You received a new message from support.",
//       createdAt: "2024-01-25T09:30:00Z",
//       isReadable: true,
//     },
//     {
//       msg: "Payment received for your recent subscription renewal.",
//       createdAt: "2024-01-20T14:10:00Z",
//       isReadable: false,
//     },
//     {
//       msg: "Security alert: Login from a new device detected.",
//       createdAt: "2024-01-18T22:50:00Z",
//       isReadable: true,
//     },
//     {
//       msg: "Your profile information has been successfully updated.",
//       createdAt: "2024-01-15T16:35:00Z",
//       isReadable: false,
//     },
//     {
//       msg: "Scheduled maintenance on February 5th at 2:00 AM.",
//       createdAt: "2024-01-12T11:20:00Z",
//       isReadable: true,
//     },
//     {
//       msg: "You have a pending friend request from John Doe.",
//       createdAt: "2024-01-10T18:05:00Z",
//       isReadable: false,
//     },
//     {
//       msg: "System upgrade completed successfully.",
//       createdAt: "2024-01-08T07:40:00Z",
//       isReadable: true,
//     },
//     {
//       msg: "Your order #123456 has been shipped!",
//       createdAt: "2024-01-05T15:15:00Z",
//       isReadable: false,
//     },
//     {
//       msg: "Password changed successfully.",
//       createdAt: "2024-01-02T20:55:00Z",
//       isReadable: true,
//     },
//     {
//       msg: "New blog post: '5 Tips to Improve Productivity'.",
//       createdAt: "2023-12-30T13:10:00Z",
//       isReadable: false,
//     },
//     {
//       msg: "Your subscription plan has been upgraded to Premium.",
//       createdAt: "2023-12-25T17:30:00Z",
//       isReadable: true,
//     },
//     {
//       msg: "A new comment was added to your post.",
//       createdAt: "2023-12-22T10:45:00Z",
//       isReadable: false,
//     },
//     {
//       msg: "You have a new follower: Sarah Thompson.",
//       createdAt: "2023-12-18T08:20:00Z",
//       isReadable: true,
//     },
//     {
//       msg: "Exclusive offer: 20% off for loyal customers!",
//       createdAt: "2023-12-15T23:50:00Z",
//       isReadable: false,
//     },
//     {
//       msg: "Your refund request has been processed.",
//       createdAt: "2023-12-12T19:05:00Z",
//       isReadable: true,
//     },
//     {
//       msg: "Join our upcoming webinar on Web Development Trends.",
//       createdAt: "2023-12-10T14:30:00Z",
//       isReadable: false,
//     },
//     {
//       msg: "Reminder: Your trial period ends in 3 days.",
//       createdAt: "2023-12-08T09:15:00Z",
//       isReadable: true,
//     },
//   ]
//   return (
//     <div className=" rounded-lg">
//       <PageHeading title={"All Notifications"}/>
//       {/* <LoaderWraperComp
//         isLoading={isLoading}
//         isError={isError}
//         className={"h-[80vh]"}
//       > */}
//         <div className="py-[24px]">
//           {notification?.map((item, index) => (
//             <div
//               key={index}
//               className="group flex items-center gap-4 px-[24px] py-4 cursor-pointer border-b border-blue-50 hover:bg-gray-100 transition-all relative"
//             >
//               <IoIosNotificationsOutline
//                 style={{ cursor: "pointer" }}
//                 className={`border border-white w-[42px] h-[42px] rounded-lg p-1.5 shadow-sm bg-[#B2DAC4] text-info group-hover:bg-[#b3dfc7]`}
//               />
//               <div className="space-y-[2px]">
//                 <h6 className="text-lg">{item.msg}</h6>
//                 <small className="text-[12px] text-gray-500">
//                   {compareByCTime(item.createdAt)}
//                 </small>
//               </div>
//               <div
//                 className={cn(
//                   "absolute right-3 inset-y-0 w-fit flex items-center",
//                   {
//                     hidden: !!item?.isReadable,
//                   }
//                 )}
//               >
//                 <div className="text-[9px] font-semibold bg-yellow-400 px-2 h-[16px] rounded-full flex items-center justify-center">
//                   New
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       {/* </LoaderWraperComp> */}
//     </div>
//   );
// };

// export default Notifications;
import React, { useEffect } from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useAdminNotificationQuery } from "../../../redux/features/Users/usersApi";
import LoaderWraperComp from "../../../Components/LoaderWraperComp";
import { cn } from "../../../lib/utils";
import { compareByCTime } from "../../../utils/impFunction";
import { useDispatch } from "react-redux";
import { resetNotification } from "../../../redux/features/Auth/notificationSlice";
import PageHeading from "../../../Components/PageHeading";

const Notifications = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch notifications from API
  const { data, isLoading, isError } = useAdminNotificationQuery(undefined);
//console.log(data,"data")
  // Reset notifications on mount
  useEffect(() => {
    dispatch(resetNotification());
  }, [dispatch]);

  // Assume the notifications are in data.data; adjust if needed
  const notifications = data?.data?.notifications || [];
  console.log(notifications,"notifications")
  return (
    <div className="rounded-lg">
      <PageHeading title={"All Notifications"} />
      <LoaderWraperComp isLoading={isLoading} isError={isError} className={"h-[80vh]"}>
        <div className="py-[24px]">
          {notifications?.map((item, index) => (
            <div
              key={index}
              className="group flex items-center gap-4 px-[24px] py-4 cursor-pointer border-b border-blue-50 hover:bg-gray-100 transition-all relative"
            >
              <IoIosNotificationsOutline
                style={{ cursor: "pointer" }}
                className="border border-white w-[42px] h-[42px] rounded-lg p-1.5 shadow-sm bg-[#B2DAC4] text-info group-hover:bg-[#b3dfc7]"
              />
              <div className="space-y-[2px]">
                <h6 className="text-lg">{item.msg}</h6>
                <small className="text-[12px] text-gray-500">
                  {compareByCTime(item.createdAt)}
                </small>
              </div>
              <div
                className={cn("absolute right-3 inset-y-0 w-fit flex items-center", {
                  hidden: !!item?.isReadable,
                })}
              >
                <div className="text-[9px] font-semibold bg-yellow-400 px-2 h-[16px] rounded-full flex items-center justify-center">
                  New
                </div>
              </div>
            </div>
          ))}
        </div>
      </LoaderWraperComp>
    </div>
  );
};

export default Notifications;
