import Position from "../models/positionModel.js";
import Department from "../models/departmentModel.js";

export const getAll = async (req, res) => {
  try {
    const activeFilter = req.query.active === "false" ? false : true;
    const positions = await Position.find({ isActive: activeFilter })
      .populate("department", "name")
      .sort({ title: 1 });
    res.json(positions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOne = async (req, res) => {
  try {
    const position = await Position.findById(req.params.positionId).populate(
      "department",
      "name"
    );
    if (!position)
      return res.status(404).json({ message: "Cargo não encontrado" });
    res.json(position);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const create = async (req, res) => {
  try {
    // Verificar se o departamento existe
    const department = await Department.findById(req.body.department);
    if (!department || !department.isActive) {
      return res
        .status(400)
        .json({ message: "Departamento inválido ou inativo" });
    }

    const newPosition = new Position(req.body);
    await newPosition.save();
    res.status(201).json(newPosition);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    if (req.body.department) {
      const department = await Department.findById(req.body.department);
      if (!department || !department.isActive) {
        return res
          .status(400)
          .json({ message: "Departamento inválido ou inativo" });
      }
    }

    const updatedPosition = await Position.findByIdAndUpdate(
      req.params.positionId,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate("department", "name");

    if (!updatedPosition)
      return res.status(404).json({ message: "Cargo não encontrado" });
    res.json(updatedPosition);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const disable = async (req, res) => {
  try {
    const position = await Position.findByIdAndUpdate(
      req.params.positionId,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    ).populate("department", "name");

    if (!position)
      return res.status(404).json({ message: "Cargo não encontrado" });
    res.json({ message: "Cargo desativado", position });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const enable = async (req, res) => {
  try {
    const position = await Position.findByIdAndUpdate(
      req.params.positionId,
      { isActive: true, updatedAt: new Date() },
      { new: true }
    ).populate("department", "name");

    if (!position)
      return res.status(404).json({ message: "Cargo não encontrado" });
    res.json({ message: "Cargo ativado", position });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOne = async (req, res) => {
  try {
    const deleted = await Position.findByIdAndDelete(req.params.positionId);
    if (!deleted)
      return res.status(404).json({ message: "Cargo não encontrado" });
    res.json({ message: "Cargo excluído" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
