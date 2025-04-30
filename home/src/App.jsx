import { useEffect, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import { ToastContainer, Bounce } from 'react-toastify';
import Intro from './pages/Intro'
import Login from './pages/Login'
import Join from './pages/Join'
import Board from './components/Board'
import MyHome from './pages/MyHome'
import MainLayout from './layouts/MainLayout'
import EmptyLayout from './layouts/EmptyLayout'
import { useSign } from "./hooks/useSign";

function App() {
  const {refreshLogin} = useSign();
  useEffect(()=>{
    refreshLogin();
  },[]);

  return (<>

    <Routes>

      <Route element={<MainLayout />}>
        <Route path="/" element={<Intro />} />
        <Route path="/board/:boardNo" element={<Board />} />
        <Route path="/myhome" element={<MyHome />} />
      </Route>


      <Route element={<EmptyLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />
      </Route>
    </Routes>

    <ToastContainer
      position="bottom-center"
      autoClose={3000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      pauseOnHover
      theme="colored"
      transition={Bounce}
    />

  </>)
}

export default App
