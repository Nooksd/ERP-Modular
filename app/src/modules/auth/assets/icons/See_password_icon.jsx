import * as styled from "./SVGStyles.js";

const SVGSeePassword = ({ show, ...props }) => {
  return (
    <>
      <styled.seePasswordSVG viewBox="0 0 24 24" fill="none" {...props}>
        {!show && (
          <styled.seePasswordPath
            d="M3.293,20.707a1,1,0,0,1,0-1.414l16-16a1,1,0,1,1,1.414,1.414l-16,16A1,1,0,0,1,3.293,20.707Z"
            fill="#000"
          />
        )}

        <path
          d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1 12C1 12 5 20 12 20C19 20 23 12 23 12"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="12"
          cy="12"
          r="3"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </styled.seePasswordSVG>
    </>
  );
};

export default SVGSeePassword;
