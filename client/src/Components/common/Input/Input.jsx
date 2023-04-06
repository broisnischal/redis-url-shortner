import { useState } from "react";
import "./index.scss";
import axios from "axios";
import { API } from "../../../store";

const Input = () => {
  const [val, setVal] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  console.log(API);

  const generate = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${API}/uri`, {
        originalurl: val,
      });
      setData(res.data);
      setErr("");
      navigator.clipboard.writeText(`${window.location.origin}/${res.data.shortKey}`);
      setVal("");
    } catch (error) {
      console.log(error);
      setErr(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="center">
        <p>Create yOur Blazingly Fast SHORT URL Here 🔥</p>
        <h4 className="error">{err}</h4>
        <input
          type="text"
          onChange={(e) => {
            setVal(e.target.value);
            setErr("");
          }}
          className="input"
          value={val}
          placeholder="*Enter a URL "
        />

        {loading ? (
          <button onClick={generate} disabled>
            Generate
          </button>
        ) : (
          <button onClick={generate}>Generate</button>
        )}
        {data ? (
          <>
            <p> Copied to Clipboard ! </p>
          </>
        ) : (
          <div> </div>
        )}
      </div>
    </>
  );
};

export default Input;
