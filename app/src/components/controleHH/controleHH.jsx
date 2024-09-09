import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserWorks } from "../../store/slicers/worksSlicer";

import * as styled from "./controleHHStyles.js";

export const ControleHH = () => {
  const works = useSelector((state) => state.works);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!works || works.status !== "succeeded") {
      dispatch(fetchUserWorks());
    }
  }, [dispatch]);

  return (
    <styled.controllContainer>
      <styled.contentDiv>
        <styled.titleDiv>Usinas</styled.titleDiv>
        {works.status === "loading" && <p>Carregando...</p>}
        {works.status === "succeeded" && (
          <ul>
            {works.works.userWorks.map((work) => (
              <li key={work._id}>{work.name}</li>
            ))}
          </ul>
        )}
        {works.status === "failed" && <p>Erro ao carregar as usinas.</p>}
      </styled.contentDiv>
      <styled.contentDiv>
        <styled.titleDiv
          style={{ justifyContent: "start", paddingLeft: "55px" }}
        >
          Controle diário da usina
        </styled.titleDiv>
      </styled.contentDiv>
    </styled.controllContainer>
  );
};
