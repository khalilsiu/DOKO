import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MetaMaskProvider } from "metamask-react";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { store } from "./store";
import ThemeProvider from "./core/ThemeProvider";

ReactDOM.render(
  <React.StrictMode>
    <MetaMaskProvider>
      <Provider store={store}>
        <ThemeProvider>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </Provider>
    </MetaMaskProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
