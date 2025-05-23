import { useEffect, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import { ToastContainer, Bounce } from 'react-toastify';
import TopMenu from './components/template/TopMenu'
import Intro from './pages/Intro'
import Login from './pages/Login'
import Join from './pages/Join'
import Board from './components/Board'
import MyPage from './pages/MyPage'
import MainLayout from './layouts/MainLayout'
import EmptyLayout from './layouts/EmptyLayout'
import { useSign } from "./hooks/useSign";
import Private from './utils/Private';
import MyWorkSpace from './pages/MyWorkSpace';
import Invitation from './pages/Invitation';

function App() {
  const {refreshLogin} = useSign();

  useEffect(()=>{
    refreshLogin();
  },[]);

  return (<>
    {/* Top Menu */}
    <TopMenu/>

    <Routes>
      {/* <Route element={<EmptyLayout />}></Route> */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Intro />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/join" element={<Join/>} />
        <Route path="/invitation" element={<Private><Invitation/></Private>} />
        <Route path="/myPage" element={<Private><MyPage/></Private>} />
        <Route path="/myWorkSpace" element={<Private><MyWorkSpace/></Private>} />
        <Route path="/board/:boardNo" element={<Private><Board/></Private>} />
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
