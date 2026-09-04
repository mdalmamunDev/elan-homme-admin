import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import ThemeProvider from "./ThemeProvider";
import { useGetUserByTokenQuery } from "../../redux/features/Auth/authApi";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/features/Auth/authSlice";
import { io } from "socket.io-client";
import { setNotification } from "../../redux/features/Auth/notificationSlice";
import toast from "react-hot-toast";

export const SocketContext = createContext({});

export const useSocket = () => useContext(SocketContext);

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [socketLoading, setSocketLoading] = useState(false);
  const socketRef = useRef(null);
  const { user, token } = useSelector((state) => state.auth);
  const { data, isLoading } = useGetUserByTokenQuery();

  useEffect(() => {
    if (!token) return; // Avoid running without a valid token
    console.log("Token:", token);
    setSocketLoading(true);

    // Disconnect previous socket if it exists
    if (socketRef.current) {
      socketRef.current.close();
    }

    // Connect using the auth option
    const socket = io(`${import.meta.env.VITE_IMAGE_URL}`, {
      transports: ["websocket"],
      auth: {
        token, // Token sent via the auth object
      },
    });

    socket.on("connect", () => {
      setSocketLoading(false);
      socketRef.current = socket;
      console.log("Socket connected");
    });

    socket.on("notification", (data) => {
      if (data) {
        dispatch(setNotification(data));
      }
    });

    socket.on("connect_error", (err) => {
      setSocketLoading(false);
      console.error("Connection error:", err);
    });

    // Cleanup on unmount
    return () => {
      socket.close();
    };
  }, [token, dispatch]);

  useEffect(() => {
    if (!isLoading) {
      dispatch(setUser({ user: data?.data || null }));
    }
  }, [data, isLoading, dispatch]);

  return (
    <ThemeProvider>
      <SocketContext.Provider value={{ socket: socketRef.current, socketLoading }}>
        {children}
      </SocketContext.Provider>
    </ThemeProvider>
  );
};

export default AuthProvider;
