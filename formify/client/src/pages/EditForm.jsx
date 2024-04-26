import React, { useEffect, useState } from "react";
import { useAuth } from "../utils/auth";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Choice from "../components/Choice";
import DeleteButton from "../components/DeleteButton";

export default function EditForm({ user }) {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [message, setMessage] = useState(null);
  const [choices, setChoices] = useState([""]);
  const [choiceType, setChoiceType] = useState("short answer");
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(null);
  const [question, setQuestion] = useState(null);
  const navigate = useNavigate();

  const addAnswer = (value, i) => {
    let choicesArray = [...choices];
    choicesArray[i] = value;
    choicesArray = choicesArray.filter((value) => value.trim());

    choicesArray.push("");
    setChoices(choicesArray);
  };

  const fetchForm = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/v1/forms/" + slug,
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + user.accessToken,
          },
        }
      );
      setData(data.form);
    } catch ({ response }) {
      if (response.status !== 401) {
        navigate("/", { replace: true });
      }
    }
  };

  const handleSubmit = async (e) => {
    setQuestion(null);
    setLoading(true);
    setMessage(null);
    setErrors(null);
    e.preventDefault();
    const formData = new FormData(e.target);
    const body = {
      name: formData.get("name"),
      choice_type: formData.get("choice_type"),
      choices: choices.filter((item) => item.trim()),
      is_required: formData.get("is_required") == "on",
    };
    try {
      const { data } = await axios.post(
        `http://localhost:8000/api/v1/forms/${slug}/questions`,
        body,
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + user.accessToken,
          },
        }
      );
      setQuestion(data);
      setChoices([""]);
      setChoiceType("short answer");
      e.target.reset();
      fetchForm();
    } catch ({ response }) {
      setErrors(response.data.errors);
      setMessage(response.data.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchForm();
  }, [user]);

  if (data == null) return <h1>Loading...</h1>;
  return (
    <>
      <div className="card">
        <div className="card-header">
          <h1>{data.name}</h1>
        </div>
        <div className="card-body">
          <p>{data.description}</p>
          {question && (
            <div className="alert alert-success" role="alert">
              Success: {question.message}
            </div>
          )}
          {message && (
            <div className="alert alert-danger" role="alert">
              Error: {message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="card mb-4 py-2">
            <div className="card-header d-flex justify-content-between">
              <div className="form-group w-100">
                <label htmlFor="name" className="form-label">
                  Create New Question
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className={"form-control " + (errors?.name && "is-invalid")}
                  placeholder="Input question name"
                  disabled={loading}
                />
                <div className="invalid-feedback">{errors?.name}</div>
              </div>
            </div>
            <div className="card-body">
              <ul className="list-group">
                <div className="form-group list-group-item">
                  <label htmlFor="choice_type" className="form-label">
                    Choice Type
                  </label>
                  <select
                    value={choiceType}
                    onChange={(e) => setChoiceType(e.target.value)}
                    className={
                      "form-select " + (errors?.choice_type && "is-invalid")
                    }
                    name="choice_type"
                    id="choice_type"
                    disabled={loading}
                  >
                    <option value="short answer">Short Answer</option>
                    <option value="paragraph">Paragraph</option>
                    <option value="date">date</option>
                    <option value="multiple choice">Multiple Choice</option>
                    <option value="dropdown">Dropdown</option>
                    <option value="checkboxes">Checkboxes</option>
                  </select>
                  <div className="invalid-feedback">{errors?.choice_type}</div>
                </div>
                <div className="form-group list-group-item">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="is_required"
                    id="is_required"
                    disabled={loading}
                  />
                  <label
                    htmlFor="is_required"
                    className="form-check-label ms-2"
                  >
                    Required
                  </label>
                </div>
                {["multiple choice", "checkboxes", "dropdown"].includes(
                  choiceType
                ) && (
                  <div className="form-group list-group-item">
                    <label htmlFor="choice_type" className="form-label">
                      Choices
                    </label>
                    {choices.map((item, i) => (
                      <input
                        value={item}
                        key={i}
                        type="text"
                        className={
                          "form-control " + (errors?.choices && "is-invalid")
                        }
                        name={`choices[${i}]`}
                        placeholder={`Input choice ${i + 1}`}
                        onChange={(e) => addAnswer(e.target.value, i)}
                        disabled={loading}
                      />
                    ))}
                    <div className="invalid-feedback">{errors?.choices}</div>
                  </div>
                )}
              </ul>
            </div>
            <div className="card-footer">
              <button
                disabled={loading}
                type="submit"
                className="btn btn-primary"
              >
                Save
              </button>
            </div>
          </form>
          {data.questions.map((item, key) => (
            <div key={key} className="card mb-4 py-2">
              <div className="card-header d-flex justify-content-between">
                <h4>{item.name}</h4>
                {(item.is_required && <h3 className="text-danger">*</h3>) || ""}
                <DeleteButton
                  url={`http://localhost:8000/api/v1/forms/${slug}/questions/${item.id}`}
                  token={user.accessToken}
                  refetch={fetchForm}
                />
              </div>
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
      </div>
    </>
  );
}
