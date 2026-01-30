import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import POSPage from './pages/POSPage.jsx';
import KitchenDisplayPage from './pages/KitchenDisplayPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<POSPage />} />
        <Route path="/kitchen-display" element={<KitchenDisplayPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
