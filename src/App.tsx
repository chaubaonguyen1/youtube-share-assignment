import React from 'react';
import './App.css';
import Header from "./components/Header/Header";
import {AuthProvider} from "./contexts/AuthContext";
import {RouterList} from "./router";
import {BrowserRouter} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header/>
        <RouterList/>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
