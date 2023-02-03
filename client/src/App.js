import "./App.css";
import Button from "./Components/common/Button";
import Input from "./Components/common/Input/Input";
import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Navigate from "./Components/layout/Navigate/Navigate";
function App() {
  // const [val, setVal] = useState("");

  return (
    <Routes>
      <Route path="/" element={<Input />}></Route>
      <Route path="/:shortkey" element={<Navigate />} />
    </Routes>
  );
}

export default App;
