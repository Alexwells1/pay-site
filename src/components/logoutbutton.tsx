import axios from "@/lib/axios";
import { LogOut } from "lucide-react";


export const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      await axios.post("/admin/logout");
        //redirect to login page 
        window.location.href = "/admin/login";
        
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={handleLogout}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </button>
  );
};
