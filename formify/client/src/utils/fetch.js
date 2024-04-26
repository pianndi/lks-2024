import axios from "axios";
const baseUrl = "http://localhost:8000/api/v1";
export const post = async (url, body, token) => {
  let data = null,
    errors = null;
  try {
    const res = await axios.post(baseUrl + url, body, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    data = res.data;
  } catch ({ response }) {
    data = response.data;
    errors = true;
  }
  return [data, errors];
};
export const get = async (url, token) => {
  let data = null,
    errors = null;
  try {
    const res = await axios.get(baseUrl + url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    data = res.data;
  } catch ({ response }) {
    data = response.data;
    errors = true;
  }
  return [data, errors];
};
