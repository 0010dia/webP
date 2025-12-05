import "./App.css";
import { Routes, Route } from "react-router-dom";
import ListPage from "./page/ListPage";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<div>메인페이지</div>}></Route>
        <Route path="/list" element={<ListPage />}></Route>
      </Routes>
    </div>
  );
}

export default App;
