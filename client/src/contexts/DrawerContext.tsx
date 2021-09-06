import { Drawer } from '@material-ui/core';
import { createContext, PropsWithChildren, useState } from 'react';
import { Intro } from '../modules/core/Intro';

interface DrawerContextValue {
  open: boolean;
  toggle: () => void;
}

export const DrawerContext = createContext<DrawerContextValue>({
  open: false,
  toggle: () => null
});

export const DrawerContextProvider = ({ children }: PropsWithChildren<any>) => {
  const [open, setOpen] = useState(false);

  return (
    <DrawerContext.Provider value={{ toggle: () => setOpen(!open), open }}>
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Intro drawer={true} />
      </Drawer>
      {children}
    </DrawerContext.Provider>
  );
};
