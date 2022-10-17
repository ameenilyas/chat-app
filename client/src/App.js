import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Chatpage from "./pages/Chatpage";
import "./index.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/chats" element={<Chatpage />} />
      </Routes>
    </div>
  );
}

export default App;
