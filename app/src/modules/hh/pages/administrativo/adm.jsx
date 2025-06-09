// Página de envio e edicao de HH

// -imports Ract, Redux- >
import { useEffect, useState } from "react";
import * as styled from "./admStyles.js";

import SVGEmployee from "../../assets/icons/adm/Employees_icon.jsx";
import SVGUser from "../../assets/icons/adm/User_icon.jsx";
import SVGUsinas from "../../assets/icons/adm/Usinas_icon.jsx";
import SVGTools from "../../assets/icons/adm/Atividades_icon.jsx";
import SVGArrowRight from "../../assets/icons/adm/ArrowRight_icon.jsx";

import Usinas from "./Usinas/usinas.jsx";
import AddUsina from "./Usinas/addUsina/addusina.jsx";
import Atividades from "./Atividades/Atv.jsx";
import AddArea from "./Atividades/addArea/addArea.jsx";

export const Adm = ({ windowHeight, modalMessage, modalInfo }) => {
  const [pageTrail, setPageTrail] = useState(
    JSON.parse(localStorage.getItem("PageTrail")) || ["Administrativo"]
  );
  const [editData, setEditData] = useState(
    localStorage.getItem("editData") || ""
  );

  const handleSelectPage = (page, index = null, editId = "") => {
    let newPageTrail = [];

    if (editId) {
      setEditData(editId);
      localStorage.setItem("editData", editId);
    } else {
      setEditData("");
      localStorage.removeItem("editData");
    }

    if (index !== null && index < pageTrail.length) {
      newPageTrail = pageTrail.slice(0, index);
      newPageTrail[index] = page;
    } else {
      newPageTrail = [...pageTrail, page];
    }

    setPageTrail(newPageTrail);
    localStorage.setItem("PageTrail", JSON.stringify(newPageTrail));
  };

  const pageSelector = () => {
    switch (pageTrail[pageTrail.length - 1]) {
      case "Usinas/Obras":
        return (
          <Usinas
            modalMessage={modalMessage}
            openPage={handleSelectPage}
            modalInfo={modalInfo}
          />
        );
      case "Adicionar Usina":
      case "Editar Usina":
        return <AddUsina editData={editData} />;
      case "Atividades de Campo":
        return (
          <Atividades
            modalMessage={modalMessage}
            openPage={handleSelectPage}
            modalInfo={modalInfo}
          />
        );
      case "Adicionar Atividade":
      case "Editar Atividade":
        return <AddArea editData={editData} />;
      default:
        alert("Página em construção");
        setPageTrail(["Administrativo"]);
    }
  };

  return (
    <styled.contentDiv $windowHeight={windowHeight}>
      {pageTrail[pageTrail.length - 1] === "Administrativo" ? (
        <>
          <styled.infoBlocksDiv>
            <styled.infoBlock $first={true}>
              <styled.infoIconDiv $first={true}>
                <SVGEmployee width="50" height="50" />
              </styled.infoIconDiv>
              <styled.infoTitleDiv>
                <h1>001</h1>
                <h4>Usinas Ativas</h4>
              </styled.infoTitleDiv>
            </styled.infoBlock>
            <styled.infoBlock>
              <styled.infoIconDiv>
                <SVGUser width="50" height="50" />
              </styled.infoIconDiv>
              <styled.infoTitleDiv>
                <h1>001</h1>
                <h4>Atividades Cadastradas</h4>
              </styled.infoTitleDiv>
            </styled.infoBlock>
          </styled.infoBlocksDiv>
          <styled.content>
            <styled.optionsBlockDiv>
              <styled.optionsTitleDiv>Controle de Obra</styled.optionsTitleDiv>
              <styled.optionButton
                onClick={() => handleSelectPage("Usinas/Obras", 1)}
              >
                <div>
                  <SVGUsinas width="20" height="20" />
                </div>
                <span>Usinas/Obras</span>
              </styled.optionButton>
              <styled.optionButton
                onClick={() => handleSelectPage("Atividades de Campo", 1)}
              >
                <div>
                  <SVGTools width="20" height="20" />
                </div>
                <span>Atividades de Campo</span>
              </styled.optionButton>
            </styled.optionsBlockDiv>
          </styled.content>
        </>
      ) : (
        <>
          <styled.pageTrailDiv>
            {pageTrail.map((page, index) => (
              <span key={index}>
                <SVGArrowRight width="20" height="20" />
                <span onClick={() => handleSelectPage(page, index)}>
                  {page}
                </span>
              </span>
            ))}
          </styled.pageTrailDiv>
          <styled.pageContent>{pageSelector()}</styled.pageContent>
        </>
      )}
    </styled.contentDiv>
  );
};
