import { useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import Welcome from './components/Welcome'
import Login from './components/Login'
import Board from './components/Board'
import MyHome from './components/MyHome'

function App() {
  

  return (<>

      {/*  */}

      {/* 컨테이너 */}
      <div className="container mt-5 pt-5" style={{minHeight: "350px"}}>
      
        <Routes>
          <Route path="/" element={<Welcome/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/board/:boardNo" element={<Board/>}></Route>
          <Route path="/myhome" element={<MyHome/>}></Route>
        </Routes>

      </div>


    </>)
}

export default App
