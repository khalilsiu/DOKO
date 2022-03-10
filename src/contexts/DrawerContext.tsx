import Drawer from '@material-ui/core/Drawer';
import { createContext, PropsWithChildren, useState } from 'react';

interface DrawerContextValue {
  open: boolean;
  toggle: () => void;
}

export const DrawerContext = createContext<DrawerContextValue>({
  open: false,
  toggle: () => null,
});

export const DrawerContextProvider = ({ children, intro }: PropsWithChildren<any>) => {
  const [open, setOpen] = useState(false);
  return (
    <DrawerContext.Provider value={{ toggle: () => setOpen(!open), open }}>
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        {intro}
      </Drawer>
      {children}
    </DrawerContext.Provider>
  );
};
