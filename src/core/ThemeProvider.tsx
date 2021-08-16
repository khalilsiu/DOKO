import { createTheme, ThemeProvider } from "@material-ui/core";
import { PropsWithChildren } from "react";

const darkTheme = createTheme({
  palette: {
    type: "dark",
  },
});

export default function Palette({ children }: PropsWithChildren<{}>) {
  return <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>;
}
