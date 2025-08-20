import Team from "../models/teamModel.js";
import Employee from "../models/employeeModel.js";

export const create = async (req, res) => {
  try {
    const newTeam = new Team({
      name: req.body.name,
    });

    await newTeam.save();
    res.status(201).json(newTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const updatedTeam = await Team.findByIdAndUpdate(
      req.params.teamId,
      {
        name: req.body.name,
      },
      { new: true, runValidators: true }
    )
      .populate("employees", "name email")
      .populate("managers", "name email");

    if (!updatedTeam)
      return res.status(404).json({ message: "Time não encontrado" });
    res.json(updatedTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addEmployee = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { employeeId } = req.body;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Funcionário não encontrado" });
    }

    const existingTeam = await Team.findOne({
      $or: [{ employees: employeeId }, { managers: employeeId }],
      isActive: true,
    });

    if (existingTeam) {
      return res.status(400).json({
        message: "Funcionário já está em outro time",
      });
    }

    const team = await Team.findById(teamId);
    if (!team || !team.isActive) {
      return res
        .status(404)
        .json({ message: "Time não encontrado ou inativo" });
    }

    const isEmployee = team.employees.some((emp) => emp.equals(employeeId));
    const isManager = team.managers.some((mgr) => mgr.equals(employeeId));

    if (isEmployee || isManager) {
      return res.status(400).json({
        message: "Funcionário já faz parte deste time",
      });
    }

    team.employees.push(employeeId);
    await team.save();

    res.json({
      message: "Funcionário adicionado ao time",
      team: team,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { employeeId } = req.body;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Time não encontrado" });
    }

    const isEmployee = team.employees.some((emp) => emp.equals(employeeId));
    const isManager = team.managers.some((mgr) => mgr.equals(employeeId));
    if (!isEmployee && !isManager) {
      return res.status(400).json({
        message: "Funcionário não está neste time",
      });
    }

    if (isEmployee) {
      team.employees = team.employees.filter((emp) => !emp.equals(employeeId));
    } else {
      team.managers = team.managers.filter((mgr) => !mgr.equals(employeeId));
    }

    await team.save();

    res.json({
      message: "Funcionário removido do time",
      team: team,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const promote = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { employeeId } = req.body;

    const team = await Team.findById(teamId);
    if (!team || !team.isActive) {
      return res
        .status(404)
        .json({ message: "Time não encontrado ou inativo" });
    }

    const isEmployee = team.employees.some((emp) => emp.equals(employeeId));
    if (!isEmployee) {
      return res.status(400).json({
        message: "Funcionário deve estar no time antes de ser promovido",
      });
    }

    const isManager = team.managers.some((mgr) => mgr.equals(employeeId));
    if (isManager) {
      return res.status(400).json({
        message: "Funcionário já é gerente deste time",
      });
    }

    team.employees = team.employees.filter((emp) => !emp.equals(employeeId));
    team.managers.push(employeeId);
    await team.save();

    res.json({
      message: "Funcionário promovido a gerente",
      team: team,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const demote = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { employeeId } = req.body;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Time não encontrado" });
    }

    const isManager = team.managers.some((mgr) => mgr.equals(employeeId));
    if (!isManager) {
      return res.status(400).json({
        message: "Funcionário não é gerente deste time",
      });
    }

    team.managers = team.managers.filter((mgr) => !mgr.equals(employeeId));
    team.employees.push(employeeId);
    await team.save();

    res.json({
      message: "Gerente rebaixado para funcionário",
      team: team,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const enable = async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(
      req.params.teamId,
      { isActive: true, updatedAt: new Date() },
      { new: true }
    )
      .populate("employees", "name email")
      .populate("managers", "name email");

    if (!team) return res.status(404).json({ message: "Time não encontrado" });
    res.json({ message: "Time ativado", team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const disable = async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(
      req.params.teamId,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    )
      .populate("employees", "name email")
      .populate("managers", "name email");

    if (!team) return res.status(404).json({ message: "Time não encontrado" });
    res.json({ message: "Time desativado", team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOne = async (req, res) => {
  try {
    const deleted = await Team.findByIdAndDelete(req.params.teamId);
    if (!deleted)
      return res.status(404).json({ message: "Time não encontrado" });
    res.json({ message: "Time excluído" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const activeFilter = req.query.active === "false" ? false : true;
    const teams = await Team.find({ isActive: activeFilter })
      .populate("employees", "name email")
      .populate("managers", "name email")
      .sort({ name: 1 });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOne = async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId)
      .populate("employees", "name email")
      .populate("managers", "name email");

    if (!team) return res.status(404).json({ message: "Time não encontrado" });
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
