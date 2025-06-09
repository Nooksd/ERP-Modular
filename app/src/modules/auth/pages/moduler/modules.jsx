import * as styled from "./modulesStyles";
import { useNavigate } from "react-router-dom";

const SelectModule = () => {
  const navigate = useNavigate();

  const modules = [
    {
      path: "hh",
      name: "Planejamento/HH",
    },
    {
      path: "rh",
      name: "DP/RH",
    },
    {
      path: "ti",
      name: "TI",
    },
  ];

  const handleSelectModule = (path) => {
    navigate(`/login/${path}`);
  };

  const renderModules = () => {
    return modules.map((module, index) => {
      return (
        <styled.SelectModuleOption
          key={index}
          onClick={() => handleSelectModule(module.path)}
        >
          {module.name}
        </styled.SelectModuleOption>
      );
    });
  };

  return (
    <styled.SelectContainer>
      <styled.SelectModule>{renderModules()}</styled.SelectModule>;
    </styled.SelectContainer>
  );
};

export default SelectModule;
