import axios from "axios";
import React, { useState } from "react";

export default function DeleteButton({ token, url, refetch }) {
  const [loading, setLoading] = useState(null);
  const handleClick = async () => {
    setLoading(true);
    try {
      await axios.delete(url, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      });
      refetch();
    } catch ({ response }) {
      //
    }
    setLoading(false);
  };
  return (
    <button className="btn btn-danger" onClick={handleClick} disabled={loading}>
      Delete
    </button>
  );
}
