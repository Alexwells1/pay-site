// src/hooks/useAdminAuth.ts
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useNavigate } from "react-router-dom";

const useAdminAuth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("/api/admin"); // protected route
        setLoading(false);
      } catch (err) {
        navigate("/admin/login");
      }
    };

    checkAuth();
  }, [navigate]);

  return { loading, setLoading };
};

export default useAdminAuth;
