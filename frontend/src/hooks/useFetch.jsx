const useFetch = () => {
  const fetchData = async (endpoint, method, body, token) => {
    const res = await fetch(import.meta.env.VITE_SERVER + endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(body),
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
