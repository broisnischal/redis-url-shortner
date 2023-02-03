import "./index.scss";

const Button = (props) => {
  return <button>{props?.value || "Generate"}</button>;
};

export default Button;
