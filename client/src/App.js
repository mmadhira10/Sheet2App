import './App.css';
import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  AppsPage,
  Dashboard,
  Header,
  Home,
  TableView,
  TablesPage,
  ViewsPage
} from './components';

import { GlobalStoreContextProvider } from './store';

function App() {
  let auth = false;

  return (
    <BrowserRouter>
      <GlobalStoreContextProvider>
        <Routes>
          <Route path="/" element={<Header auth={auth} />} />
          <Route path="/apps" element={<AppsPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tableview" element={<TableView />} />
          <Route path="/tables" element={<TablesPage />} />
          <Route path="/views" element={<ViewsPage />} />
        </Routes>
      </GlobalStoreContextProvider>
    </BrowserRouter>
  );
}

export default App;
