const SVGConnector = ({ cap = 0, ...props }) => {
  return (
    <svg
      width="28"
      height="53"
      viewBox="0 0 28 50"
      fill="none"
      {...props}
      style={{ marginTop: "-50px" }}
    >
      <path d={`M35 50H2V${cap}`} stroke="#E6E6E6" strokeWidth="3" />
    </svg>
  );
};

export default SVGConnector;
