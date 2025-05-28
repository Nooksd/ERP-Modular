import { Fragment, useEffect, useState, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSlider } from "../../store/slicers/sliderSlicer.js";
import { innovaApi } from "../../services/http.js";

import * as styled from "./sliderStyles.js";

import { Dashboard } from "./components/dashboard.jsx";

export const Slider = ({ windowHeight }) => {
  const dispatch = useDispatch();
  const [slider1, setSlider1] = useState(0);
  const [slider2, setSlider2] = useState(2);

  setTimeout(() => {
    setSlider1(1);
    setSlider2(3);
  }, 2000);

  useEffect(() => {}, [dispatch]);
  return (
    <styled.contentDiv $windowHeight={windowHeight}>
      <styled.content>
        <styled.dashboardContainer $state={slider1}>
          <Dashboard
            windowHeight={windowHeight}
            selectedWork={"67c991487c2447765e20cd8b"}
          />
        </styled.dashboardContainer>
        <styled.dashboardContainer $state={slider2}>
          <Dashboard
            windowHeight={windowHeight}
            selectedWork={"67c9f94d7c2447765e212380"}
          />
        </styled.dashboardContainer>
      </styled.content>
    </styled.contentDiv>
  );
};
