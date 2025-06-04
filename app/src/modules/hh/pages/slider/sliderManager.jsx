import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserWorks } from "../../store/slicers/worksSlicer";
import {
  fetchSlider,
  updateSlider,
  sendImage,
} from "../../store/slicers/sliderSlicer.js";

import { Loading } from "@/styles/global.js";

import * as styled from "./sliderManagerStyles.js";

import SVGDelete from "../../assets/icons/controleHH/Delete_icon.jsx";
import SVGPlaySlides from "../../assets/icons/slider/Play_slides_icon.jsx";

export const SliderManager = ({ toastMessage, windowHeight }) => {
  const works = useSelector((state) => state.works);
  const { items, link } = useSelector((state) => state.slider);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const slidesEndRef = useRef(null);

  const [slides, setSlides] = useState([]);

  const [slidesError, setSlidesError] = useState(false);

  useEffect(() => {
    if (!works || works.status !== "succeeded") {
      dispatch(fetchUserWorks());
    }
  }, [dispatch]);

  useEffect(() => {
    if (!items || items.length === 0) {
      dispatch(fetchSlider());
    }
  }, [dispatch]);

  useEffect(() => {
    if (items && items.length > 0) {
      setSlides(items);
    }
  }, [items]);

  useEffect(() => {
    if (link && link !== "") {
      setSlides((prev) => [
        ...prev,
        { link: link, title: "", time: 2000, type: "image" },
      ]);
    }
  }, [link]);

  const handleAddImage = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    dispatch(sendImage(formData));
  };

  const handleDeleteSlide = (index) => {
    setSlides((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInput = (index, field, value) => {
    if (field === "time") {
      value = value.replace(/[^0-9]/g, "");

      if (isNaN(value) || value < 0) {
        value = "";
      }

      if (value > 0) value = value * 1000;
    }

    const newSlides = slides.map((slide, i) => {
      if (i === index) {
        return {
          ...slide,
          error: false,
          [field]: value,
        };
      } else {
        return slide;
      }
    });

    setSlides(newSlides);
  };

  const handleUpdateSlides = async () => {
    const isValid = validateSlides();

    if (isValid) {
      dispatch(updateSlider({ items: slides })).then((result) => {
        console.log(result);

        if (result.meta.requestStatus === "fulfilled") {
          toastMessage({
            danger: false,
            title: "Sucesso",
            message: "Slides atualizados com sucesso",
          });
        } else {
          toastMessage({
            danger: true,
            title: "Error",
            message: "Ocorreu um erro ao atualizar os slides",
          });
        }
      });
    }
  };

  function validateSlides() {
    let isValid = true;

    const newSlides = slides.map((slide) => {
      let hasError = false;

      if (
        slide.title.trim() === "" ||
        slide.type.trim() === "" ||
        (slide.type !== "image" && slide.type !== "work") ||
        slide.time < 2000 ||
        slide.link.trim() === ""
      ) {
        hasError = true;
        isValid = false;
      }

      return {
        ...slide,
        error: hasError,
      };
    });

    if (slides.length < 2) {
      isValid = false;
      setSlidesError(true);
    }

    setSlides(newSlides);
    return isValid;
  }

  const renderWorks = () => {
    if (works.status === "loading") {
      return (
        <ul>
          <styled.work style={{ marginBottom: "30px" }}>
            <Loading />
          </styled.work>
          <styled.work style={{ marginBottom: "30px" }}>
            <Loading />
          </styled.work>
          <styled.work style={{ marginBottom: "30px" }}>
            <Loading />
          </styled.work>
        </ul>
      );
    } else if (works.status === "succeeded") {
      return (
        <ul>
          {works.works.userWorks.map((work, index) => {
            if (slides.find((slide) => slide.link === work._id)) return null;
            return (
              <styled.work
                draggable
                key={index}
                onDragStart={(e) => handleWorkDragStart(e, work)}
              >
                {work.name}
              </styled.work>
            );
          })}
        </ul>
      );
    }
    return [];
  };

  const [draggingIndex, setDraggingIndex] = useState(null);

  const [hoverIndex, setHoverIndex] = useState(null);

  const handleDragStart = (index) => {
    setDraggingIndex(index);
  };

  const handleWorkDragStart = (event, work) => {
    event.dataTransfer.setData("workId", work._id);
    event.dataTransfer.setData("workTitle", work.name);
  };

  const handleDragEnter = (index) => {
    if (draggingIndex !== null && draggingIndex !== index) {
      setHoverIndex(index);
    }
  };

  const handleDragEnd = () => {
    if (hoverIndex !== null && draggingIndex !== null) {
      const newSlides = [...slides];
      const [draggedSlide] = newSlides.splice(draggingIndex, 1);

      if (draggingIndex < hoverIndex) {
        newSlides.splice(hoverIndex, 0, draggedSlide);
      } else {
        newSlides.splice(hoverIndex + 1, 0, draggedSlide);
      }

      setSlides(newSlides);
    }
    setDraggingIndex(null);
    setHoverIndex(null);
  };

  const handleDrop = (event) => {
    const workId = event.dataTransfer.getData("workId");
    const workTitle = event.dataTransfer.getData("workTitle");

    if (!workId || !workTitle) return;

    const verifySlide = slides.find((slide) => slide.link === workId);
    if (verifySlide) return;

    setSlidesError(false);

    if (!slides.find((slide) => slide.link === workId)) {
      setSlides([
        ...slides,
        { link: workId, title: workTitle, time: 2000, type: "work" },
      ]);
    }
  };

  const renderSlides = () => {
    if (slides && slides.length > 0) {
      return slides.map((slide, index) => {
        return (
          <styled.slideDiv
            key={index}
            $onHover={hoverIndex === index}
            $isDragging={draggingIndex === index + 1}
            $error={slide.error}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragEnd={handleDragEnd}
          >
            <styled.SlideTextInput
              type="text"
              name="title"
              value={slide.title}
              placeholder="Título do slide"
              onChange={(e) => {
                if (slide.type === "work") return;
                handleInput(index, "title", e.target.value);
              }}
            ></styled.SlideTextInput>

            <styled.SlideTextInput
              type="number"
              name="time"
              value={slide.time > 0 ? slide.time / 1000 : ""}
              placeholder="Tempo do slide"
              onChange={(e) => handleInput(index, "time", e.target.value)}
            ></styled.SlideTextInput>

            <styled.switchDiv>
              <styled.switchLabel>
                {slide.type === "image" ? "Tela cheia" : "Filtros"}
              </styled.switchLabel>
              <styled.Switch
                onClick={() => {
                  setSlides((prev) =>
                    prev.map((s, i) =>
                      i === index ? { ...s, filter: !s.filter } : s
                    )
                  );
                }}
              >
                <styled.SwitchButton $active={slide.filter} />
              </styled.Switch>
            </styled.switchDiv>

            <styled.deleteButton onClick={() => handleDeleteSlide(index)}>
              <SVGDelete />
            </styled.deleteButton>
          </styled.slideDiv>
        );
      });
    }
  };

  const handleNavigate = () => navigate("/hh/slider");

  return (
    <styled.Container $windowHeight={windowHeight}>
      <styled.contentDiv $error={slidesError} style={{ maxWidth: "300px" }}>
        <styled.titleDiv>Usinas</styled.titleDiv>
        {renderWorks()}
        {works.status === "failed" && <p>Erro ao carregar as usinas.</p>}
      </styled.contentDiv>

      <styled.contentDiv>
        <styled.titleDiv
          style={{ justifyContent: "start", paddingLeft: "55px" }}
        >
          Configurações slider
          <styled.goToSliderButton onClick={() => handleNavigate()}>
            <SVGPlaySlides />
          </styled.goToSliderButton>
        </styled.titleDiv>

        <styled.sliderDiv
          $windowHeight={windowHeight}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {renderSlides()}

          <styled.addImageButton ref={slidesEndRef}>
            <input type="file" accept="image/*" onChange={handleAddImage} />
          </styled.addImageButton>
        </styled.sliderDiv>
        <styled.finalCheckDiv>
          <styled.addOneMoreButton
            style={{ fontSize: 16 }}
            onClick={() => handleUpdateSlides()}
          >
            Enviar
          </styled.addOneMoreButton>
        </styled.finalCheckDiv>
      </styled.contentDiv>
    </styled.Container>
  );
};
