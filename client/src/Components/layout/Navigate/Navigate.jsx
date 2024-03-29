import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../../store";

const Navigate = () => {
  const [err, setErr] = useState("");
  const { shortkey } = useParams();

  useEffect(() => {
    const redirectClient = async () => {
      try {
        const res = await axios.get(`${API}/uri/${shortkey}`);
        window.location.replace(res.data);
      } catch (error) {
        setErr(error.response.data.message);
      }
    };
    redirectClient();
  }, [shortkey]);

  return <div>{err ? err : <h4 style={{ textAlign: "center" }}>Proceding to webpage ...</h4>}</div>;
};

export default Navigate;
