import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"

export default function NavBar() {

    const navigate = useNavigate();
    return (
        <nav className="flex flex-wrap justify-between items-center gap-2 sm:gap-4 p-2 sm:p-4 bg-gray-300">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 truncate">Cadence Architect</h2>
                <img src={logo} alt="logo" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0" />
            </div>
            <div className="flex gap-2 sm:gap-3 md:gap-4 flex-wrap justify-end">
                <button 
                    onClick={() => navigate("/home")}
                    className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base bg-indigo-900 text-white rounded hover:bg-indigo-800 whitespace-nowrap"
                >
                    Home
                </button>
                <button 
                    onClick={() => navigate("/generate")}
                    className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base bg-indigo-900 text-white rounded hover:bg-indigo-800 whitespace-nowrap"
                >
                    Generate
                </button>
            </div>
        </nav>
    )
}