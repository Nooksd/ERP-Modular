import Department from "../models/departmentModel.js";

export const getAll = async (req, res) => {
  try {
    const activeFilter = req.query.active === "false" ? false : true;
    const departments = await Department.find({ isActive: activeFilter }).sort({
      name: 1,
    });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOne = async (req, res) => {
  try {
    const department = await Department.findById(req.params.departmentId);
    if (!department)
      return res.status(404).json({ message: "Departamento não encontrado" });
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const newDepartment = new Department(req.body);
    await newDepartment.save();
    res.status(201).json(newDepartment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.departmentId,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!updatedDepartment)
      return res.status(404).json({ message: "Departamento não encontrado" });
    res.json(updatedDepartment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const disable = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.departmentId,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );
    if (!department)
      return res.status(404).json({ message: "Departamento não encontrado" });
    res.json({ message: "Departamento desativado", department });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const enable = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.departmentId,
      { isActive: true, updatedAt: new Date() },
      { new: true }
    );
    if (!department)
      return res.status(404).json({ message: "Departamento não encontrado" });
    res.json({ message: "Departamento ativado", department });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOne = async (req, res) => {
  try {
    const deleted = await Department.findByIdAndDelete(req.params.departmentId);
    if (!deleted)
      return res.status(404).json({ message: "Departamento não encontrado" });
    res.json({ message: "Departamento excluído" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
