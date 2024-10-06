import Layout from "./layouts/layout";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/search" element={<Search />} />
          <Route path="/heatmap" element={<HeatMap />} />
          <Route path="/about" element={<About />} />
          <Route path="/learnmore" element={<LearnMore />} />
          <Route path="/apidocs" element={<APIDocs />} /> */}
        </Routes>
      </Layout>
    </div>
  );
}

export default App;

