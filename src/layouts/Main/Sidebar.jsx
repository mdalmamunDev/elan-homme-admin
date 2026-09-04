import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { createElement, useState } from "react";
import { routeLinkGenerators } from "../../utils/routeLinkGenerators";
import { dashboardItems } from "../../constants/router.constants";
import Swal from "sweetalert2";
import { FiLogOut } from "react-icons/fi";
import { MdOutlineArrowRight } from "react-icons/md";
import { cn } from "../../lib/utils";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/features/Auth/authSlice";
import logo from '../../assets/images/logo.svg'
const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openNome, setOpenNome] = useState({});
  const handleLogOut = () => {
    Swal.fire({
      text: "Are you sure you want to logout?",
      showCancelButton: true,
      confirmButtonText: "     Sure    ",
      cancelButtonText: "Cancel",
      showConfirmButton: true,
      confirmButtonColor: "#DC2626",
      reverseButtons: true,
    }).then((res) => {
      if (res.isConfirmed) {
        dispatch(logout());
        localStorage.clear();
        navigate("/auth");
      }
    });
  };
  // useEffect(() => {
  // }, [location.pathname]);
  return (
    <div className="fixed top-0 left-0 w-[280px] min-h-screen h-full p-4 pe-0">
      <div className="h-full flex flex-col justify-between bg-g rounded-md border drop-shadow pt-[1px]">
        <div className="">
          <div className="w-full flex justify-center items-center pt-10">
            <img src={logo} alt="" />
          </div>
          <ul className="max-h-[650px] overflow-y-auto space-y-1 xl:space-y-2 hide-scrollbar">
            {routeLinkGenerators(dashboardItems).map(
              ({ name, icon, path, children, rootPath }, indx) =>
                children?.length ? (
                  <li key={indx} className="overflow-hidden">
                    <button
                      onClick={() => {
                        setOpenNome((c) => ({
                          name: c?.name === name ? null : name,
                        }));
                      }}
                      className={cn(
                        "outline-none text-white text-[20px] w-full pl-6 pr-4 py-3 flex items-center justify-between gap-3 text-lg transition-all font-medium",
                        {
                          "text-lime-400":
                            name !== openNome?.name &&
                            (location.pathname.includes(rootPath) &&
                              openNome.name),
                        }
                      )}
                    >
                      <div className="flex items-center justify-start gap-3">
                        <div>{createElement(icon, { size: "20" })}</div>
                        <span>{name}</span>
                      </div>
                      <MdOutlineArrowRight
                        className={cn("text-white-500", {
                          "rotate-90 text-white":
                            name === openNome?.name ||
                            (location.pathname.includes(rootPath) &&
                              !openNome.name),
                        })}
                        size={23}
                      />
                    </button>
                    <div
                      className={cn(
                        "space-y-0.5 h-0 overflow-hidden",
                        {
                          "h-fit pt-1":
                            name === openNome?.name ||
                            (location.pathname.includes(rootPath) &&
                              !openNome.name),
                        }
                      )}
                    >
                      {children?.map(({ subName, subPath, subIcon }, inx) => (
                        <NavLink
                          key={inx}
                          to={subPath}
                          className={({ isActive }) =>
                            isActive
                              ? "bg-white text-s-1 w-full pl-6 pr-4 py-3 flex items-center justify-start gap-3 text-[16px] font-medium transition-all ms-4"
                              : "text-white hover:text-indigo-200 w-full pl-6 pr-4 py-3 flex items-center justify-start gap-3 text-[16px] font-medium transition-all ms-4"
                          }
                        >
                          <div>{createElement(subIcon, { size: "17" })}</div>
                          <span> {subName}</span>
                        </NavLink>
                      ))}
                    </div>
                  </li>
                ) : (
                  <li
                    onClick={() => {
                      setOpenNome((c) => ({
                        name: c?.name === name ? null : name,
                      }));
                    }}
                    key={indx}
                  >
                    <NavLink
                      to={path}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-white text-indigo-500 text-s-1 w-full pl-6 pr-4 py-3 flex items-center justify-start gap-3 text-[16px] font-medium transition-all"
                          : "text-white hover:text-indigo-200 w-full pl-6 pr-4 py-3 flex items-center justify-start gap-3 text-[16px] font-medium transition-all"
                      }
                    >
                      <div>{createElement(icon, { size: "20" })}</div>
                      <span>{name}</span>
                    </NavLink>
                  </li>
                )
            )}
          </ul>
        </div>
        <div className="p-4 mt-auto">
          <button
            onClick={handleLogOut}
            className="bg-light-gray/20 w-full px-4 py-3 flex items-center justify-start gap-3 text-lg outline-none text-white rounded-lg"
          >
            <FiLogOut className="text-red-400" size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
