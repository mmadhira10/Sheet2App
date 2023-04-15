import './App.css';
import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  HomeWrapper,
  TablesPage,
  ViewsPage,
  EditApp,
  RunApp
} from './components';
import { useEffect, useState } from "react";
import { GlobalStoreContextProvider } from './store';
import { AuthContextProvider } from './auth';


function App() {

  return (
    <BrowserRouter>
      <AuthContextProvider>
        <GlobalStoreContextProvider>
          <Routes>
            <Route path="/" element={<HomeWrapper />} />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            {/* <Route path="/tableview" element={<TableView />} /> */}
            <Route path="/tables" element={<TablesPage />} />
            <Route path="/views" element={<ViewsPage />} />
            <Route path="/editApp" element={<EditApp />} />
            <Route path="/runApp" element={<RunApp />} />
          </Routes>
        </GlobalStoreContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
