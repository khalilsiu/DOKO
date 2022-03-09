import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MetaMaskProvider } from 'metamask-react';
import { HelmetProvider } from 'react-helmet-async';
import 'leaflet/dist/leaflet.css';
import './index.scss';
import { CookiesProvider } from 'react-cookie';
import { Provider } from 'react-redux';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ThemeProvider from './core/ThemeProvider';
import store from './store/store';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <MetaMaskProvider>
          <ThemeProvider>
            <CookiesProvider>
              <CssBaseline />
              <App />
            </CookiesProvider>
          </ThemeProvider>
        </MetaMaskProvider>
      </HelmetProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
