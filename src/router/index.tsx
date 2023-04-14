import {Route, Routes} from "react-router-dom";
import Home from "../pages/Home/Home";
import Post from "../pages/Post/Post";

export function RouterList() {
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/post" element={<Post/>}/>
    </Routes>
  );
}