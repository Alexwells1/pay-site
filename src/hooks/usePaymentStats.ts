import axios from "@/lib/axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function usePaymentStats() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);



  useEffect(() => {
    axios
      .get("/admin/stats", { withCredentials: true })
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          navigate("/admin/login");
        } else {
          toast.error("Failed to load payment stats");
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  return { stats, loading, setLoading };
}
