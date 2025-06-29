import React, { useMemo,  useContext, createContext } from "react";
import type { ReactNode } from "react";
import { io, Socket } from "socket.io-client";

// Define the type for your context
interface SocketContextValue {
  socket: Socket;
}

// Create context with proper typing
const SocketContext = createContext<SocketContextValue | undefined>(undefined);

// Custom hook to use the socket
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

// Props for provider
interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const socket = useMemo(() => io("http://localhost:8001"), []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
