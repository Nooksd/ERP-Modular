import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSlider } from "../../store/slicers/sliderSlicer.js";
import { baseURL } from "@/services/http";

import * as styled from "./sliderStyles.js";

import { Dashboard } from "./components/dashboard.jsx";

export const Slider = ({ windowHeight }) => {
  const { items } = useSelector((state) => state.slider);

  const dispatch = useDispatch();

  const [activeSlide1, setActiveSlide1] = useState({
    slider: 1,
  });
  const [activeSlide2, setActiveSlide2] = useState({
    slider: 2,
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(1);

  useEffect(() => {
    if (!items || items.length === 0) {
      dispatch(fetchSlider());
    }
  }, [dispatch]);

  useEffect(() => {
    if (items && items.length > 1) {
      setActiveSlide1({ ...items[0], position: 0, slider: 1 });
      setActiveSlide2({ ...items[1], position: 2, slider: 2 });
      setCurrentIndex(1);
    }
  }, [items]);

  useEffect(() => {
    if (!items || items.length === 0) return;

    if (activeSlide1.position === 1 || activeSlide1.position === 3) {
      returnToFixedPosition();
    }

    if (activeSlide1.position === 0) {
      slide1TimeOut();
    } else if (activeSlide2.position === 0) {
      slide2TimeOut();
    }
  }, [activeSlide1, activeSlide2]);

  function slide1TimeOut() {
    setTimeout(() => {
      setActiveSlide1({ ...activeSlide1, position: 1 });
      setActiveSlide2({ ...activeSlide2, position: 3 });
      setCurrentSlide(2);
    }, activeSlide1.time);
  }

  function slide2TimeOut() {
    setTimeout(() => {
      setActiveSlide1({ ...activeSlide1, position: 3 });
      setActiveSlide2({ ...activeSlide2, position: 1 });
      setCurrentSlide(1);
    }, activeSlide2.time);
  }

  function returnToFixedPosition() {
    setTimeout(() => {
      const nextIndex = getNextIndex();

      if (currentSlide === 1) {
        setActiveSlide2({
          ...items[nextIndex],
          slider: 2,
          position: 0,
        });
      } else {
        setActiveSlide1({
          ...items[nextIndex],
          slider: 1,
          position: 0,
        });
      }

      if (activeSlide1.position === 1) {
        setActiveSlide1((prev) => ({ ...prev, position: 2 }));
      }
      if (activeSlide2.position === 1) {
        setActiveSlide2((prev) => ({ ...prev, position: 2 }));
      }
      if (activeSlide1.position === 3) {
        setActiveSlide1((prev) => ({ ...prev, position: 0 }));
      }
      if (activeSlide2.position === 3) {
        setActiveSlide2((prev) => ({ ...prev, position: 0 }));
      }

      setCurrentIndex(nextIndex);
    }, 1200);
  }

  function getNextIndex() {
    const nextIndex = currentIndex + 1;

    if (nextIndex >= items.length) {
      return 0;
    }

    return nextIndex;
  }

  return (
    <styled.contentDiv $windowHeight={windowHeight}>
      <styled.content>
        {activeSlide1?.type === "work" && (
          <styled.dashboardContainer
            $state={activeSlide1.position}
            $title={activeSlide1.title}
          >
            <Dashboard
              selectedWork={activeSlide1.link}
              toggleFilters={activeSlide1.filter ? activeSlide1.time : 0}
              position={activeSlide1.position}
            />
          </styled.dashboardContainer>
        )}

        {activeSlide1?.type === "image" && (
          <styled.imageContainer
            $state={activeSlide1.position}
            $title={activeSlide1.title}
            $fullScreen={activeSlide1.filter}
          >
            <styled.image
              src={`${baseURL}hh/slider/get-image/${activeSlide1.link}`}
              alt={activeSlide1.title}
              $fullScreen={activeSlide1.filter}
            />
          </styled.imageContainer>
        )}

        {activeSlide2?.type === "work" && (
          <styled.dashboardContainer
            $state={activeSlide2.position}
            $title={activeSlide2.title}
          >
            <Dashboard
              selectedWork={activeSlide2.link}
              toggleFilters={activeSlide2.filter ? activeSlide2.time : 0}
              position={activeSlide2.position}
            />
          </styled.dashboardContainer>
        )}

        {activeSlide2?.type === "image" && (
          <styled.imageContainer
            $state={activeSlide2.position}
            $title={activeSlide2.title}
            $fullScreen={activeSlide2.filter}
          >
            <styled.image
              src={`${baseURL}hh/slider/get-image/${activeSlide2.link}`}
              alt={activeSlide2.title}
              $fullScreen={activeSlide2.filter}
            />
          </styled.imageContainer>
        )}
      </styled.content>
    </styled.contentDiv>
  );
};
