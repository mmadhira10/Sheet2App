import './App.css';
import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  AppsPage,
  Dashboard,
  Header,
  Home,
  TableView
} from './components';

import { GlobalStoreContextProvider } from './store';

function App() {
  let auth = false;

  return (
    <BrowserRouter>
      <GlobalStoreContextProvider>
        <Header auth={auth} />
        <Routes>
          <Route path="/" element={<Header auth={auth} />} />
          <Route path="/apps" element={<AppsPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tableview" element={<TableView />} />
        </Routes>
      </GlobalStoreContextProvider>
    </BrowserRouter>
  );
}

export default App;
