import React from "react";
import { TailSpin } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const AdminRoutes = ({ children }) => {
  const location = useLocation();
  const { user, isLoading } = useSelector((state) => state.auth);
  // console.log( {user,isLoading})
  if (isLoading) {
    return (
      <div
        className={`h-screen w-full flex flex-col justify-center items-center`}
      >
        <TailSpin
          visible={true}
          height="70"
          width="70"
          color="#4fa94d"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{}}
          wrapperClass=""
        />
        <p className="mt-5 font-mono text-gray-500 text-center">
          Please Wait <br /> ....
        </p>
      </div>
    );
  }
  if (user?.role === "admin") {
    return children;
  }
  //   return <Navigate to="/auth" state={{ from: location }} replace />;
  // };
  return <Navigate state={location.pathname} to="/auth" />;
};

export default AdminRoutes;
