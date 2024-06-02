
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
      <Route path="/atlas/" element={<Atlasgrid/>}/>
      <Route path="/about/" element={<About/>}/>
      
    </Routes>
    </BrowserRouter>

    
  );
}

export default App;
