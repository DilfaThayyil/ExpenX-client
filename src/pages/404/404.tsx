import { Warning404 } from "@404pagez/react";
import { useNavigate } from "react-router-dom";

export const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col justify-center items-center min-h-screen gap-6">
            <Warning404 size={20} />
            <button 
                onClick={() => navigate("/")} 
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg shadow-md hover:bg-emerald-700 transition"
            >
                Go Home
            </button>
            <p>or</p>
            <button 
                onClick={() => navigate("/login")} 
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg shadow-md hover:bg-emerald-700 transition"
            >
                Login
            </button>
        </div>
    );
};
