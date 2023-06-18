import './App.css';
import { RecoilRoot } from 'recoil';
import Login from './sections/Login.js';
import MainPage from './sections/MainPage.js';
import RegisterPage from './sections/RegisterPage.js';
import Manager from "./sections/Manager";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <RecoilRoot>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />}/>
            <Route path="/main" element={<MainPage />}/>
            <Route path="/registerPage" element={<RegisterPage />}/>
            <Route path="/Manager" element={<Manager />}/>
          </Routes>
        </BrowserRouter>
       </RecoilRoot> 
    </div>
  );
}

export default App;