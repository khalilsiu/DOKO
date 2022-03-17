import config from 'config';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import { openToast } from 'store/app/appStateSlice';
import { AuthContext, AuthContextType } from './AuthContext';

interface ServerToClientEvents {
  event: (data: string) => void;
  LeaseCreated: (message: any) => void;
  LeaseAccepted: (message: any) => void;
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
  const { address } = useContext(AuthContext) as AuthContextType;
  const dispatch = useDispatch();
  socket &&
    socket
      .on('LeaseCreated', () => {
        dispatch(
          openToast({
            message: 'Lease has been created',
            state: 'success',
            action: 'refresh',
          }),
        );
      })
      .on('LeaseAccepted', () => {
        dispatch(
          openToast({
            message: 'Lease has been accepted',
            state: 'success',
            action: 'refresh',
          }),
        );
      });
  useEffect(() => {
    const socket = io(config.holdingsServiceSocketUrl || '', {
      secure: true,
      transports: ['flashsocket', 'polling', 'websocket'],
    });
    setSocket(socket);
    return () => {
      if (socket) {
        setSocket(null);
      }
    };
  }, []);

  useEffect(() => {
    if (address && socket) {
      socket.emit('join', address);
    }
  }, [address]);

  return <WSContext.Provider value={{ socket }}>{children}</WSContext.Provider>;
};
