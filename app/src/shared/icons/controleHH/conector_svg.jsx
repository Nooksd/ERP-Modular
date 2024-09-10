const SVGConnector = ({ ...props }) => {
  return (
    <svg width="28" height="50" viewBox="0 0 28 50" fill="none" {...props} style={{ marginTop: "-40px"}}>
      <path d="M28 48H2V0" stroke="#E6E6E6" strokeWidth="3" />
    </svg>
  );
};

export default SVGConnector;
