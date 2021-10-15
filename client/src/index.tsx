// eslint-disable-next-line no-use-before-define
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MetaMaskProvider } from 'metamask-react';
import { MoralisProvider } from 'react-moralis';
import { HelmetProvider } from 'react-helmet-async';

import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store } from './store';
import ThemeProvider from './core/ThemeProvider';
import { config } from './config';

ReactDOM.render(
  <React.StrictMode>
    <HelmetProvider>
      <MetaMaskProvider>
        <Provider store={store}>
          <ThemeProvider>
            <MoralisProvider
              appId={config.moralisApplicationId}
              serverUrl={config.moralisServerUrl}
            >
              <CssBaseline />
              <App />
            </MoralisProvider>
          </ThemeProvider>
        </Provider>
      </MetaMaskProvider>
    </HelmetProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
