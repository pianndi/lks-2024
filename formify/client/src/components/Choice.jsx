import React, { useEffect, useState } from "react";

export default function Choice({ type, choices, index, required }) {
  const [checkboxes, setCheckbox] = useState([]);

  const handleCheck = (checked, value, i) => {
    const checkArray = [...checkboxes];
    if (checked) {
      checkArray[i] = value;
    } else {
      checkArray.splice(i);
    }
    setCheckbox(checkArray);
  };

  if (type == "short answer") {
    return (
      <input
        className="form-control"
        type="text"
        name={`answers[${index}][value]`}
        required={required}
        placeholder="Input your answer"
      />
    );
  } else if (type == "paragraph") {
    return (
      <textarea
        className="form-control"
        name={`answers[${index}][value]`}
        required={required}
        cols="30"
        rows="10"
        placeholder="Input your answer"
      ></textarea>
    );
  } else if (type == "date") {
    return (
      <input
        className="form-control"
        type="date"
        name={`answers[${index}][value]`}
        required={required}
      />
    );
  } else if (type == "multiple choice") {
    const jawaban = choices.split(",");
    return (
      <ul className="list-group">
        {jawaban.map((item, key) => (
          <li key={key} className="list-group-item">
            <label className="form-check-label">
              <input
                className="form-check-input me-2"
                name={`answers[${index}][value]`}
                required={required}
                type="radio"
                value={item}
              />
              {item}
            </label>
          </li>
        ))}
      </ul>
    );
  } else if (type == "dropdown") {
    const jawaban = choices.split(",");
    return (
      <select
        className="form-select"
        name={`answers[${index}][value]`}
        required={required}
      >
        {jawaban.map((item, key) => (
          <option key={key} value={item}>
            {item}
          </option>
        ))}
      </select>
    );
  } else if (type == "checkboxes") {
    const jawaban = choices.split(",");

    return (
      <ul className="list-group">
        <input
          type="hidden"
          value={checkboxes.filter((item) => item).join(",")}
          name={`answers[${index}][value]`}
        />
        {jawaban.map((item, key) => (
          <li key={key} className="list-group-item">
            <input
              id={item + key + index}
              type="checkbox"
              className="form-check-input"
              value={item}
              onChange={(e) => handleCheck(e.target.checked, item, key)}
            />
            <label
              htmlFor={item + key + index}
              className="form-check-label ms-2"
            >
              {item}
            </label>
          </li>
        ))}
      </ul>
    );
  }
}
