import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../utils/auth";
import { Link } from "react-router-dom";

export default function Home() {
  const [data, setData] = useState(null);
  const { user } = useAuth();
  const fetchForm = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/v1/forms", {
        headers: {
          Authorization: "Bearer " + user.accessToken,
        },
      });
      setData(data.forms);
    } catch ({ response }) {
      //
    }
  };
  useEffect(() => {
    fetchForm();
  }, [user]);
  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h1>Home</h1>
        <Link to='/form/create' className="btn btn-primary">Create New Form</Link>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Link</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((item, key) => {
              return (
                <tr key={key}>
                  <td>{item.name}</td>
                  <td>
                    <Link to={`${item.slug}/responses`}>
                      http://localhost:8000/{item.slug}/responses
                    </Link>
                  </td>
                  <td>
                    <Link to={item.slug} className="btn btn-primary">
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      {data == null && <h2>Loading..</h2>}
    </>
  );
}
