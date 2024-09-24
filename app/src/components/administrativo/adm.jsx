// Página de envio e edicao de HH

// -imports Ract, Redux- >
import { useEffect, useState } from "react";
import * as styled from "./admStyles.js";

import SVGEmployee from "../../shared/icons/adm/Employees_icon.jsx";
import SVGUser from "../../shared/icons/adm/User_icon.jsx";
import SVGUsinas from "../../shared/icons/adm/Usinas_icon.jsx";
import SVGTools from "../../shared/icons/adm/Atividades_icon.jsx";
import SVGEmployees from "../../shared/icons/adm/Colaboradores_icon.jsx";
import SVGCentroCusto from "../../shared/icons/adm/CentroC_icon.jsx";
import SVGDepartments from "../../shared/icons/adm/Departments_icon.jsx";
import SVGAdictives from "../../shared/icons/adm/Adictives_icon.jsx";
import SVGTeam from "../../shared/icons/adm/Team_icon.jsx";
import SVGAppUsers from "../../shared/icons/adm/Users_icon.jsx";
import SVGPages from "../../shared/icons/adm/Pages_icon.jsx";
import SVGStatus from "../../shared/icons/adm/Status_icon.jsx";
import SVGLogs from "../../shared/icons/adm/Logs_icon.jsx";
import SVGArrowRight from "../../shared/icons/adm/ArrowRight_icon.jsx";

import Usinas from "./Usinas/usinas.jsx";
import Employees from "./Employees/Employees.jsx";
import Users from "./Users/Users.jsx";
import Atividades from "./Atividades/Atv.jsx";

export const Adm = ({ windowHeight }) => {
  const [selectedPage, setSelectedPage] = useState(
    localStorage.getItem("Page")
  );
  const [pageTrail, setPageTrail] = useState(["Administrativo"]);

  useEffect(() => {
    setPageTrail(["Administrativo", selectedPage]);
  }, [selectedPage]);

  const handleSelectPage = (page) => {
    setSelectedPage(page);
    localStorage.setItem("Page", page);
  };

  const pageSelector = () => {
    switch (selectedPage) {
      case "Colaboradores":
        return <Employees setPage={setSelectedPage} />;
      case "Usinas/Obras":
        return <Usinas setPage={setSelectedPage} />;
      case "Atividades de Campo":
        return <Atividades setPage={setSelectedPage} />;
      case "Usuários":
        return <Users setPage={setSelectedPage} />;
      default:
        alert("Página em construção");
        setSelectedPage("Administrativo");
    }
  };

  return (
    <styled.contentDiv $windowHeight={windowHeight}>
      {selectedPage === "Administrativo" ? (
        <>
          <styled.infoBlocksDiv>
            <styled.infoBlock $first={true}>
              <styled.infoIconDiv $first={true}>
                <SVGEmployee width="50" height="50" />
              </styled.infoIconDiv>
              <styled.infoTitleDiv>
                <h1>001</h1>
                <h4>Funcionários Cadastrados</h4>
              </styled.infoTitleDiv>
            </styled.infoBlock>
            <styled.infoBlock>
              <styled.infoIconDiv>
                <SVGUser width="50" height="50" />
              </styled.infoIconDiv>
              <styled.infoTitleDiv>
                <h1>001</h1>
                <h4>Usuários Cadastrados</h4>
              </styled.infoTitleDiv>
            </styled.infoBlock>
          </styled.infoBlocksDiv>
          <styled.content>
            <styled.optionsBlockDiv>
              <styled.optionsTitleDiv>
                Controle de Empresa
              </styled.optionsTitleDiv>
              <styled.optionButton
                onClick={() => handleSelectPage("Colaboradores")}
              >
                <div>
                  <SVGEmployees width="30" height="35" />
                </div>
                <span>Colaboradores</span>
              </styled.optionButton>
              <styled.optionButton
                onClick={() => handleSelectPage("Centros de Custos")}
              >
                <div>
                  <SVGCentroCusto width="20" height="20" />
                </div>
                <span>Centros de Custos</span>
              </styled.optionButton>
              <styled.optionButton
                onClick={() => handleSelectPage("Departamentos")}
              >
                <div>
                  <SVGDepartments width="20" height="20" />
                </div>
                <span>Departamentos</span>
              </styled.optionButton>
              <styled.optionButton onClick={() => handleSelectPage("Aditivos")}>
                <div>
                  <SVGAdictives width="20" height="20" />
                </div>
                <span>Aditivos</span>
              </styled.optionButton>
              <styled.optionButton onClick={() => handleSelectPage("Equipes")}>
                <div>
                  <SVGTeam width="20" height="20" />
                </div>
                <span>Equipes</span>
              </styled.optionButton>
              <styled.optionsTitleDiv>Controle de Obra</styled.optionsTitleDiv>
              <styled.optionButton
                onClick={() => handleSelectPage("Usinas/Obras")}
              >
                <div>
                  <SVGUsinas width="20" height="20" />
                </div>
                <span>Usinas/Obras</span>
              </styled.optionButton>
              <styled.optionButton
                onClick={() => handleSelectPage("Atividades de Campo")}
              >
                <div>
                  <SVGTools width="20" height="20" />
                </div>
                <span>Atividades de Campo</span>
              </styled.optionButton>
            </styled.optionsBlockDiv>
            <styled.optionsBlockDiv>
              <styled.optionsTitleDiv>
                Controle da aplicação
              </styled.optionsTitleDiv>
              <styled.optionButton onClick={() => handleSelectPage("Usuários")}>
                <div>
                  <SVGAppUsers width="20" height="20" />
                </div>
                <span>Usuários</span>
              </styled.optionButton>
              <styled.optionButton onClick={() => handleSelectPage("Páginas")}>
                <div>
                  <SVGPages width="17" height="20" />
                </div>
                <span>Páginas</span>
              </styled.optionButton>
              <styled.optionButton onClick={() => handleSelectPage("Status")}>
                <div>
                  <SVGStatus width="20" height="20" />
                </div>
                <span>Status</span>
              </styled.optionButton>
              <styled.optionButton
                onClick={() => handleSelectPage("Histórico")}
              >
                <div>
                  <SVGLogs width="20" height="20" />
                </div>
                <span>Histórico</span>
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
                <span onClick={() => handleSelectPage(page)}>{page}</span>
              </span>
            ))}
          </styled.pageTrailDiv>
          <styled.pageContent>{pageSelector()}</styled.pageContent>
        </>
      )}
    </styled.contentDiv>
  );
};
