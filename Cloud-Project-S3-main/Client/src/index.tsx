import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain='dev-mei12s29.us.auth0.com'
      clientId='zpT0sVvA2z2zcIwr0i8eTgsniCNMEBSC'
      redirectUri={`${window.location.origin}/dashboard`}
      audience="https://dev-mei12s29.us.auth0.com/api/v2/"
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
