const SVGControll = ({ ...props }) => {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27 9H21V3H25.5C26.328 3 27 3.672 27 4.5V9ZM27 21V25.5C27 26.328 26.328 27 25.5 27H21V21H27ZM12 18H18V12H12V18ZM9 27H4.5C3.672 27 3 26.328 3 25.5V21H9V27ZM3 9V4.5C3 3.672 3.672 3 4.5 3H9V9H3ZM27 0H21H18V9H12V0H9H3C1.3425 0 0 1.3425 0 3V9V12H9V18H0V21V27C0 28.6575 1.3425 30 3 30H9H12V21H18V30H21H27C28.6575 30 30 28.6575 30 27V21V18H21V12H30V9V3C30 1.3425 28.6575 0 27 0Z"
        fill="#172242"
      />
    </svg>
  );
};

export default SVGControll;
