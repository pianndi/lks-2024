import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function CreateForm({ user }) {
  const [loading, setLoading] = useState(null);
  const [errors, setErrors] = useState(null);
  const [domains, setDomains] = useState([""]);
  const [data, setData] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const addDomain = (value, i) => {
    let domainArray = [...domains];
    domainArray[i] = value;
    domainArray = domainArray.filter((item) => item.trim());
    domainArray.push("");
    setDomains(domainArray);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);
    setData(null);
    setMessage(null);
    const formData = new FormData(e.target);
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/v1/forms",
        formData,
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + user.accessToken,
          },
        }
      );
      setData(data);
      e.target.reset();
      navigate(`/${data.form.slug}`);
    } catch ({ response }) {
      if (response.status != 401) {
        setErrors(response.data.errors);
        setMessage(response.data.message);
      }
    }
    setLoading(false);
  };
  return (
    <>
      <h1>Create Form</h1>
      {data && (
        <div className="alert alert-success" role="alert">
          Success: {data.message}
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
              Form Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className={"form-control " + (errors?.name && "is-invalid")}
              placeholder="Input form name"
              disabled={loading}
            />
            <div className="invalid-feedback">{errors?.name}</div>
          </div>
        </div>
        <div className="card-body">
          <ul className="list-group">
            <div className="form-group list-group-item">
              <label htmlFor="slug" className="form-label">
                Form Slug
              </label>
              <input
                type="text"
                name="slug"
                id="slug"
                className={"form-control " + (errors?.slug && "is-invalid")}
                placeholder="Input form slug"
                disabled={loading}
              />
              <div className="invalid-feedback">{errors?.slug}</div>
            </div>
            <div className="form-group list-group-item">
              <label htmlFor="description" className="form-label">
                Form description
              </label>
              <textarea
                type="text"
                name="description"
                id="description"
                className={
                  "form-control " + (errors?.description && "is-invalid")
                }
                placeholder="Input form description"
                disabled={loading}
              />
              <div className="invalid-feedback">{errors?.description}</div>
            </div>
            <div className="form-group list-group-item">
              <input
                type="checkbox"
                className="form-check-input"
                name="is_required"
                id="is_required"
                disabled={loading}
              />
              <label htmlFor="is_required" className="form-check-label ms-2">
                Limit One Response
              </label>
            </div>

            <div className="form-group list-group-item">
              <label htmlFor="choice_type" className="form-label">
                Allowed Domains
              </label>
              {domains.map((item, i) => (
                <input
                  value={item}
                  key={i}
                  type="text"
                  className={
                    "form-control " + (errors?.choices && "is-invalid")
                  }
                  name={`allowed_domains[${i}]`}
                  placeholder={`domain ${i + 1}`}
                  onChange={(e) => addDomain(e.target.value, i)}
                  disabled={loading}
                />
              ))}
              <div className="invalid-feedback">{errors?.choices}</div>
            </div>
          </ul>
        </div>
        <div className="card-footer">
          <button disabled={loading} type="submit" className="btn btn-primary">
            Save
          </button>
        </div>
      </form>
    </>
  );
}
