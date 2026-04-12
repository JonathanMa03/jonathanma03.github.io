import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/variables.css';
import './styles/globals.css';
import './styles/layout.css';
import './styles/animations.css';
import 'katex/dist/katex.min.css';

const params = new URLSearchParams(window.location.search);
const redirect = params.get('redirect');

if (redirect) {
  window.history.replaceState(null, '', redirect);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);