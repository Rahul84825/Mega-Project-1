import { useState, useEffect, useCallback } from "react";
import { api } from "../utils/api";

const useApi = (path, options = {}) => {
  const { immediate = true, token = null } = options;

  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error,   setError]   = useState(null);

  const fetch = useCallback(async (overridePath) => {
    const endpoint = overridePath || path;
    if (!endpoint) return;
    setLoading(true);
    setError(null);
    try {
      const result = await api.get(endpoint, token || localStorage.getItem("token"));
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [path, token]);

  useEffect(() => {
    if (immediate && path) fetch();
  }, [path, immediate]);

  return { data, loading, error, refetch: fetch };
};

export default useApi;