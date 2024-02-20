
import {BrowserRouter, Route, Routes } from "react-router-dom";

import './App.css';
import Navbar from "./pages/Navbar";
import Atlasgrid from "./pages/Atlasgrid";
import About from "./pages/About";


function App() {
  return (
    <BrowserRouter>
      <Navbar />
    <Routes>
      <Route path="/" element={<Atlasgrid/>}/>
      <Route path="/About" element={<About/>}/>
      
    </Routes>
    </BrowserRouter>

    
  );
}

export default App;
