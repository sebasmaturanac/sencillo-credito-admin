const baseURL =
  process.env.NODE_ENV === "development" // eslint-disable-line
    ? "http://localhost:3100/api"
    : "https://api.sencillo.ar/api";

export default baseURL;
