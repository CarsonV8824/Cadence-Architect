import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"

export default function NavBar() {

    const navigate = useNavigate();
    return (
        <nav className="flex justify-between items-center gap-4 p-4 bg-gray-300 ">
            <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-800">Cadence Architect</h2>
                <img src={logo} alt="logo" className="w-12 h-12" />
            </div>
            <div className="flex gap-4">
                <button 
                    onClick={() => navigate("/home")}
                    className="px-4 py-2 bg-indigo-900 text-white rounded hover:bg-indigo-800"
                >
                    Home
                </button>
                <button 
                    onClick={() => navigate("/generate")}
                    className="px-4 py-2 bg-indigo-900 text-white rounded hover:bg-indigo-800"
                >
                    Generate
                </button>
            </div>
        </nav>
    )
}