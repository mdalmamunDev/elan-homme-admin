import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar } from "antd";
import profileImage from "../../assets/images/admin.png";
import { useSelector } from "react-redux";
// import { useAdminNotificationBadgeQuery } from "../../redux/features/Users/usersApi";

// const socket = io(`${import.meta.env.VITE_IMAGE_URL}`);

const Header = () => {
  const navigate = useNavigate();
  const loacatin = useLocation();
  const notificationRef = useRef(null);
  const [notificationPopup, setNotificationPopup] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { total, notification } = useSelector((state) => state.notification);
  // const { data } = useAdminNotificationBadgeQuery(undefined, {
  //   refetchOnMountOrArgChange: true,
  // });
  // const data = {};
  useEffect(() => {
    // notification popup
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setNotificationPopup(false);
  }, [loacatin.pathname]);

  return (
    <div className="w-full h-[88px] flex justify-between items-center rounded-md py-[16px] px-[32px] bg-g text-white shadow-sm relative">
      <div className="text-start space-y-0.5">
        <p className="text-[24px] font-medium">
          Welcome {user?.name || "to Roam !!!"}
        </p>
        <p className="">Have a nice day!</p>
      </div>
      <div className="flex gap-x-6">
        {/* <button
          // onBlur={() => setNotificationPopup(false)}
          // onClick={() => setNotificationPopup((c) => !c)}
          onMouseEnter={() => setNotificationPopup(true)}
          className="relative flex items-center "
        >
          <Badge
            style={{ backgroundColor: " #FFD700", color: "black" }}
            // data?.data?.unreadCount || 0 + notificationCount
            count={data?.data?.unreadCount || 0 + total}
            showZero
            offset={[-10, 15]}
          >
            <IoNotificationsOutline
              style={{ cursor: "pointer" }}
              className={`text-white hover:text-lime-400 w-[48px] h-[48px] rounded-full p-2 shadow transition-all`}
            />
          </Badge>
        </button> */}
        <div
          onClick={(e) => navigate("/settings/profile")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Avatar size={52} icon={<img
            title="Profile"
            src={
              user?.profileImage
                ? `${import.meta.env.VITE_IMAGE_URL}/` +
                user?.profileImage
                : profileImage
            }
            alt=""
            className="w-full h-full object-cover border border-blue-600 rounded-full"
          />}
          />
          {/* <FaAngleDown className="size-3.5 text-white" /> */}
        </div>
      </div>
      {/* {!!notificationPopup && (
        <div
          ref={notificationRef}
          className={
            "absolute top-[88px] right-0 bg-white shadow-lg border border-gray-50 rounded-md px-3 py-4 max-w-[400px] w-fit"
          }
        >
          <div>
            {data?.data?.latestNotifications.map((item, idx) => (
              <div
                key={idx}
                className="group flex items-center gap-4 px-[14px] py-2 cursor-pointer hover:bg-gray-100 transition-all"
              >
                <IoIosNotificationsOutline
                  // style={{ cursor: "pointer" }}
                  className={`border border-white min-w-[40px] min-h-[40px] rounded-lg p-1.5 shadow-sm bg-[#B2DAC4] text-info group-hover:bg-[#b3dfc7]`}
                />
                <div className="">
                  <h6 className="line-clamp-1">{item.msg}</h6>
                  <small className="text-[11px] text-gray-500">
                    {compareByCTime(item.createdAt)}
                  </small>
                </div>
              </div>
            ))}
          </div>
          <div className="w-fit mx-auto mt-4">
            <Button
              onClick={(e) => navigate("notifications")}
              style={{ background: "#34D399", color: "white" }}
              size="middle"
              type="primary"
              className="w-40"
            >
              See More
            </Button>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Header;
