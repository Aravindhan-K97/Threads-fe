import { createContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import io from "socket.io-client";
import userAtom from "../atoms/userAtom";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const user = useRecoilValue(userAtom);

  useEffect(() => {
    if (user?._id) {
      const socketConnection = io("/", {
        query: {
          userId: user._id,
        },
      });

      console.log("Socket connected:", socketConnection);
      setSocket(socketConnection);

      socketConnection.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => {
        socketConnection.close();
      };
    }
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
