import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { get } from "../utils/fetch";

export default function ResponseForm({ user }) {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState(null);

  const fetchForm = async () => {
    const [data, errors] = await get("/forms/" + slug, user.accessToken);
    const [{ responses }] = await get(
      "/forms/" + slug + "/responses",
      user.accessToken
    );
    data.responses = responses;
    setData(data);
    setErrors(errors);
  };
  useState(() => {
    fetchForm();
  }, user);
  console.log(data);
  if (data == null) return <h1>Loading...</h1>;
  return (
    <>
      <h1>{data.form.name}</h1>
      <p>{data.form.description}</p>
      <table className="table">
        <thead>
          <tr>
            <th>No</th>
            <th>Email</th>
            {data.form.questions.map((item, key) => {
              return <th key={key}>{item.name}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {data.responses.map((response, key) => {
            return (
              <tr key={key}>
                <td>{key + 1}</td>
                <td>{response.user.email}</td>
                {data.form.questions.map((item, key) => {
                  return (
                    <td key={key}>
                      {response.answers[item.name + key] || "-"}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
