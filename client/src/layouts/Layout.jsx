
import Navbar from "../components/Navbar";
import Headerspace from "../components/Headerspace";
import "../App.css";
const Layout = (props) => {
  // General layout for the components
  return (
    <div className="flex h-auto w-full flex-col">
      <Navbar />
      <Headerspace />
      <div className="flex flex-1 h-auto">
        {/* might need this late overflow-y-scroll below */}
        <div className="w-full text-gray-700 p-2 m-2 h-auto mt-10 mb-16">
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default Layout;