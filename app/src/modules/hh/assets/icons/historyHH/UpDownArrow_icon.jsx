const SVGUpDown = ({ decrescent, ...props }) => {
  return (
    <svg width="27" height="26" viewBox="0 0 27 26" fill="none" {...props}>
      <path
        d="M14.7663 7.3824H10.4527V15.0768L4.31324 15.0754V7.3824H0L7.38315 0L14.7663 7.3824Z"
        fill="#172242"
        opacity={decrescent ? 0.5 : 1}
      />
      <path
        d="M19.2398 26L26.6222 18.618H22.3097V10.9243L16.1703 10.9228V18.618H11.857L19.2398 26Z"
        fill="#172242"
        opacity={decrescent ? 1 : 0.5}
      />
    </svg>
  );
};

export default SVGUpDown;
