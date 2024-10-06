import Layout from "./layouts/layout";
import Home from "./pages/Home";
import About from "./pages/About"
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Visualization from "./pages/Visualization";

function App() {
  return (
    <div className="App">
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/viz" element={<Visualization />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;

