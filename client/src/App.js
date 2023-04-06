import "./App.css";
import Input from "./Components/common/Input/Input";
import { Routes, Route } from "react-router-dom";
import Navigate from "./Components/layout/Navigate/Navigate";
import Custom from "./Components/common/Custom";
import { API } from "./store";
function App() {
  // const [val, setVal] = useState("");

  console.log(process.env);

  console.log(API);
  return (
    <Routes>
      <Route path="/" element={<Input />}></Route>
      <Route path="/custom" element={<Custom />}></Route>

      <Route path="/:shortkey" element={<Navigate />} />
    </Routes>
  );
}

export default App;
