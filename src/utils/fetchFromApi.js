// require("dotenv").config();

let baseUrl = "https://fakestoreapi.com";
// let baseUrl = process.env.BASE_URL;

async function fetchFromApi(path) {
  const res = await fetch(`${baseUrl}/${path}`);
  const data = await res.json();
  return data;
}

export default fetchFromApi;
