const Key = ({ onClick, text, wide, blue, orange }) => {
  return (
    <button
      onClick={onClick}
      className={["key", wide && "wide", blue && "blue", orange && "orange"].join(" ")}
    >
      {text}
    </button>
  );
};

export default Key;
