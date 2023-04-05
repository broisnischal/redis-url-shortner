import { useState } from "react";
import "./index.scss";
import axios from "axios";
import { API } from "../../../store";

const Custom = () => {
  const [val, setVal] = useState("");
  const [custom, setCustom] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const generate = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${API}/uri/custom`, {
        originalurl: val,
        customshorturl: custom,
      });
      setData(res.data);
      setErr("");
      navigator.clipboard.writeText(`${window.location.origin}/${res.data.shortKey}`);
      setVal("");
      setCustom("");
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
        <input
          style={{ marginTop: "10px" }}
          type="text"
          onChange={(e) => {
            setCustom(e.target.value);
            setErr("");
          }}
          className="input"
          value={custom}
          placeholder="Enter Custom Url Parameter "
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

export default Custom;
