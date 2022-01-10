import { Box } from '@material-ui/core';
import { ReactNode } from 'react';

interface TabPanelProps {
  children?: ReactNode;
  dir?: string;
  index: any;
  value: any;
}

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
      style={{ width: '100%' }}
    >
      {value === index && <Box paddingY={4}>{children}</Box>}
    </div>
  );
}

export default TabPanel;
