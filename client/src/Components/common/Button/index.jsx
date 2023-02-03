import "./index.scss";

const Button = (props) => {
  return <button className="customButton">{props?.value || "Generate"}</button>;
};

export default Button;
