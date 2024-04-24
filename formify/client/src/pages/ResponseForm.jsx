import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Choice from "../components/Choice";

export default function ResponseForm({ user }) {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(null)

  const fetchForm = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/v1/forms/" + slug,
        {
          headers: {
            Accept: 'application/json',
            Authorization: "Bearer " + user.accessToken,
          },
        }
      );
      setData(data.form);
    } catch ({ response }) {
      if (response.status != 401) {
        console.log(response)
        setMessage(response.data.message);
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const { data } = await axios.post(
        `http://localhost:8000/api/v1/forms/${slug}/responses`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + user.accessToken,
          },
        }
      );
      setSuccess(data)
    } catch (err) {
      console.log(err)
      setMessage(response.data.message)
    }
  };
  useEffect(() => {
    fetchForm();
  }, [user]);

  if (message)
    return (
      <div className="alert alert-danger" role="alert">
        Error: {message}
      </div>
    );
  if (data == null) return <h1>Loading...</h1>;

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="card-header">
        <h1>{data.name}</h1>
      </div>
      <div className="card-body">
        <p>{data.description}</p>
        {data.questions.map((item, key) => (
          <div key={key} className="card mb-4 py-2">
            <div className="card-header d-flex justify-content-between">
              <h4>{item.name}</h4>
              {(item.is_required && <h3 className="text-danger">*</h3>) || ""}
            </div>
            <input
              type="hidden"
              value={item.id}
              name={`answers[${key}][question_id]`}
            />
            <div className="card-body">
              <Choice
                type={item.choice_type}
                choices={item.choices}
                index={key}
                required={item.is_required}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="card-footer">
        <button type="submit" className="btn btn-primary">
          Submit form
        </button>
      </div>
    </form>
  );
}
