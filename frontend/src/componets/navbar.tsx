import { useNavigate } from "react-router-dom";

export default function NavBar() {

    const navigate = useNavigate();
    return (
        <nav className="flex justify-between items-center gap-4 p-4 bg-gray-300 ">
            <div className="text-2xl font-bold text-gray-800">
                Cadence Architect
            </div>
            <div className="flex gap-4">
                <button 
                    onClick={() => navigate("/home")}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Home
                </button>
                <button 
                    onClick={() => navigate("/generate")}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Generate
                </button>
            </div>
        </nav>
    )
}