const SVGAlert = ({ ...props }) => {
  return (
    <svg
      fill="#000000"
      height="800px"
      width="800px"
      x="0px"
      y="0px"
      viewBox="0 0 24 24"
      enableBackground="new 0 0 24 24"
      {...props}
    >
      <g id="Alert-Filled">
        <g>
          <path d="M12,1L0,23h24L12,1z M13,19h-2v-2h2V19z M11,16v-6h2v6H11z" />
        </g>
      </g>
    </svg>
  );
};

export default SVGAlert;
