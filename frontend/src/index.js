import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain="dev-a2ozvfuacpfd0qu3.us.auth0.com"
        clientId="BgRL3fu75uqMY5NDrlPrKnWP2qAAF0A3"
        authorizationParams={{
          redirect_uri: 'http://localhost:3000/home'
        }}
      >
        <App />
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>
);


