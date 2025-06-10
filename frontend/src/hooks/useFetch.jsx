const useFetch = () => {
  const fetchData = async (
    endpoint,
    method,
    body,
    token,
    isFormData = false
  ) => {
    const headers = {};

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
      headers["Authorization"] = "Bearer " + token;
    }
    const res = await fetch(import.meta.env.VITE_SERVER + endpoint, {
      method,
      headers,
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });
    const data = await res.json();

    if (!res.ok) {
      // catch errors from validators
      if (data?.errors) {
        console.error(data.errors[0].msg);
        return { ok: false, data: data.errors[0].msg };
      }

      // catch errors from controllers
      if (data.status === "error") {
        console.error(data.msg);
        return { ok: false, data: data.msg };
      }

      console.error("an unknown error has occurred");
      return { ok: false, data: "unknown error" };
    }

    return { ok: true, data };
  };

  return fetchData;
};

export default useFetch;
