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

function App() {
  let auth = false;

  return (
    <BrowserRouter>
      <Header auth={auth} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apps" element={<AppsPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tableview" element={<TableView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
