import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import './index.css';
import App from './App.jsx';
import Modal from 'react-modal'

//apply bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootswatch/dist/zephyr/bootstrap.min.css";
import "bootstrap";

//axios 기본 주소 설정
import axios from "axios";
axios.defaults.baseURL = "http://localhost:8080/api";//기본주소
axios.defaults.timeout=10000;//타임아웃(ms)

Modal.setAppElement('#root');

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </BrowserRouter>
)
