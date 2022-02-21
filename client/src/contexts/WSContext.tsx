import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import { openToast } from '../store/app';

interface ServerToClientEvents {
  event: (data: string) => void;
  LeaseCreated: (message: any) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ClientToServerEvents {
  join: (payload: any) => void;
}

type SocketIO = Socket<ServerToClientEvents, ClientToServerEvents>;

interface WSContextValue {
  socket: SocketIO | null;
}

export const WSContext = createContext<WSContextValue>({
  socket: null,
});

export const WSContextProvider = ({ children }: PropsWithChildren<any>) => {
  const [socket, setSocket] = useState<SocketIO | null>(null);
  const dispatch = useDispatch();
  socket &&
    socket.on('LeaseCreated', () => {
      dispatch(
        openToast({ message: 'Lease has been created', state: 'success', action: 'refresh' }),
      );
    });
  useEffect(() => {
    const socket = io(process.env.REACT_APP_CONTRACT_SERVICE_SOCKET || '', {
      secure: true,
      transports: ['flashsocket', 'polling', 'websocket'],
    });
    setSocket(socket);
    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    };
  }, []);

  return <WSContext.Provider value={{ socket }}>{children}</WSContext.Provider>;
};