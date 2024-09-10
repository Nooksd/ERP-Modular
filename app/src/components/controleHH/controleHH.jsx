import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserWorks } from "../../store/slicers/worksSlicer";
import Calendar from "../../shared/includes/calendar/calendar.jsx";

import * as styled from "./controleHHStyles.js";
import SVGCalendar from "../../shared/icons/controleHH/calendar_icon.jsx";
import SVGDelete from "../../shared/icons/controleHH/Delete_icon.jsx";
import SVGConnector from "../../shared/icons/controleHH/conector_svg.jsx";

const formatKey = (day, month, year) => {
  return `${String(day).padStart(2, "0")}${String(month + 1).padStart(
    2,
    "0"
  )}${year}`;
};

export const ControleHH = () => {
  const works = useSelector((state) => state.works);
  const dispatch = useDispatch();
  const date = new Date();

  const [selectedWork, setSelectedWork] = useState("");
  const [selectedDay, setSelectedDay] = useState(
    formatKey(date.getDate(), date.getMonth(), date.getFullYear())
  );

  const emptyRole = {
    role: "",
    quantity: "",
    hours: "",
  };

  const emptyActivity = {
    open: false,
    area: "",
    activity: "",
    subActivity: "",
    workDescription: "",
    roles: [{ ...emptyRole }],
  };

  const [openCalendar, setOpenCalendar] = useState(false);
  const [activities, setActivities] = useState([{ ...emptyActivity }]);

  const activitiesEndRef = useRef(null);

  const selectWork = (work) => {
    setSelectedWork(work);
  };

  useEffect(() => {
    if (!works || works.status !== "succeeded") {
      dispatch(fetchUserWorks());
    }
  }, [dispatch]);

  const handleAddActivity = () => {
    setActivities((prev) => [...prev, { ...emptyActivity }]);

    setTimeout(() => {
      activitiesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 10);
  };

  const handleDeleteActivity = (index) => {
    setActivities((prev) => prev.filter((_, i) => i !== index));
  };

  const selectWorks = () => {
    if (works.status === "loading") {
      return (
        <ul>
          <styled.work>Carregando...</styled.work>
          <styled.work>Carregando...</styled.work>
          <styled.work>Carregando...</styled.work>
        </ul>
      );
    } else if (works.status === "succeeded") {
      return (
        <ul>
          {works.works.userWorks.map((work) => (
            <styled.work
              key={work._id}
              $isSelected={selectedWork === work._id}
              onClick={() => selectWork(work._id)}
            >
              {work.name}
            </styled.work>
          ))}
        </ul>
      );
    }
    return [];
  };

  const renderActivities = () => {
    return (
      activities.length > 0 && (
        <>
          {activities.map((activity, index) => (
            <styled.activityDiv key={index}>
              <styled.visibleActivityDiv>
                <styled.openActivityButton
                  onClick={() =>
                    setActivities((prev) =>
                      prev.map((a, i) =>
                        i === index ? { ...a, open: !a.open } : a
                      )
                    )
                  }
                >
                  { activities[index].open ? "-" : "+"}
                </styled.openActivityButton>
                <styled.activityInputDiv>
                  <styled.deleteButton
                    onClick={() => handleDeleteActivity(index)}
                  >
                    <SVGDelete />
                  </styled.deleteButton>
                </styled.activityInputDiv>
              </styled.visibleActivityDiv>
              {activity.open && (
                <styled.hiddenActivityDiv>
                  <styled.visibleActivityDiv>
                    <SVGConnector />
                    <styled.openActivityButton>+</styled.openActivityButton>
                    <styled.activityDiv></styled.activityDiv>
                  </styled.visibleActivityDiv>
                </styled.hiddenActivityDiv>
              )}
            </styled.activityDiv>
          ))}
        </>
      )
    );
  };

  return (
    <styled.controllContainer>
      <styled.contentDiv>
        <styled.titleDiv>Usinas</styled.titleDiv>
        {selectWorks()}
        {works.status === "failed" && <p>Erro ao carregar as usinas.</p>}
      </styled.contentDiv>
      <styled.contentDiv>
        <styled.titleDiv
          style={{ justifyContent: "start", paddingLeft: "55px" }}
        >
          Controle diário da usina
          <styled.calendarContainerWrapper>
            {openCalendar && (
              <styled.calendarContainer>
                <Calendar
                  selectedDay={selectedDay}
                  onDaySelect={setSelectedDay}
                />
              </styled.calendarContainer>
            )}

            <SVGCalendar onClick={() => setOpenCalendar((prev) => !prev)} />
          </styled.calendarContainerWrapper>
        </styled.titleDiv>

        <styled.hhRecordDiv>
          {renderActivities()}
          <styled.addOneMoreButton
            onClick={() => handleAddActivity()}
            ref={activitiesEndRef}
          >
            +
          </styled.addOneMoreButton>
        </styled.hhRecordDiv>
      </styled.contentDiv>
    </styled.controllContainer>
  );
};
