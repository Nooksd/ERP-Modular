import Employee from "../models/employeeModel.js";
import mongoose from "mongoose";

const IMMUTABLE_FIELDS = ["firstName", "lastName", "esocial", "documents"];

export const create = async (req, res) => {
  try {
    const employeeData = req.body;

    const newEmployee = new Employee(employeeData);

    newEmployee.isActive = true;
    newEmployee.createdAt = new Date();
    newEmployee.updatedAt = new Date();
    newEmployee.status = "Ativo";

    await newEmployee.save();

    res.status(201).json({
      status: true,
      message: "Funcionário criado com sucesso",
      employee: newEmployee,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        status: false,
        message: "Erro de validação",
        errors,
      });
    }

    res.status(500).json({
      status: false,
      message: "Erro ao criar funcionário",
      error: error.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.employeeId);
    if (!employee) {
      return res.status(404).json({
        status: false,
        message: "Funcionário não encontrado",
      });
    }

    const changes = [];
    const updateData = req.body;

    for (const field of IMMUTABLE_FIELDS) {
      if (updateData[field] !== undefined) {
        return res.status(403).json({
          status: false,
          message: `Campo '${field}' é imutável e não pode ser alterado`,
        });
      }
    }

    for (const [key, value] of Object.entries(updateData)) {
      if (
        employee[key] !== undefined &&
        JSON.stringify(employee[key]) !== JSON.stringify(value)
      ) {
        changes.push({
          changedBy: req.user.user._id,
          field: key,
          oldValue: employee[key],
          newValue: value,
        });
      }
    }

    Object.assign(employee, updateData);

    if (changes.length > 0) {
      employee.changeHistory.push(...changes);
    }

    employee.updatedAt = new Date();
    await employee.save();

    res.json({
      status: true,
      message: "Funcionário atualizado",
      employee,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        status: false,
        message: "Erro de validação",
        errors,
      });
    }

    res.status(500).json({
      status: false,
      message: "Erro ao atualizar funcionário",
      error: error.message,
    });
  }
};

export const updateAllocation = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.employeeId);
    if (!employee) {
      return res.status(404).json({
        status: false,
        message: "Funcionário não encontrado",
      });
    }

    const newAllocation = req.body;
    const changes = [];

    for (const [key, value] of Object.entries(newAllocation)) {
      if (
        employee.allocation[key] !== undefined &&
        JSON.stringify(employee.allocation[key]) !== JSON.stringify(value)
      ) {
        changes.push({
          changedBy: req.user.user._id,
          field: `allocation.${key}`,
          oldValue: employee.allocation[key],
          newValue: value,
        });
      }
    }

    employee.allocation = { ...employee.allocation, ...newAllocation };

    if (changes.length > 0) {
      employee.changeHistory.push(...changes);
    }

    employee.updatedAt = new Date();
    await employee.save();

    res.json({
      status: true,
      message: "Alocação atualizada",
      allocation: employee.allocation,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        status: false,
        message: "Erro de validação",
        errors,
      });
    }

    res.status(500).json({
      status: false,
      message: "Erro ao atualizar alocação",
      error: error.message,
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.employeeId)
      .populate("allocation.position", "name")
      .populate("allocation.department", "name")
      .populate("allocation.workingLocation", "name")
      .populate("changeHistory.changedBy", "email");

    if (!employee) {
      return res.status(404).json({
        status: false,
        message: "Funcionário não encontrado",
      });
    }

    res.json({
      status: true,
      employee,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Erro ao obter funcionário",
      error: error.message,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const { active, query } = req.query;
    const filter = {};

    if (active !== undefined) {
      filter.isActive = active === "true";
    }

    if (query) {
      filter.$or = [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        { "allocation.position": { $regex: query, $options: "i" } },
        { "allocation.department": { $regex: query, $options: "i" } },
        { "allocation.workingCity": { $regex: query, $options: "i" } },
      ];
    }

    const employees = await Employee.find(filter, {
      firstName: 1,
      lastName: 1,
      modality: 1,
      "allocation.position": 1,
      "allocation.workingLocation": 1,
      "allocation.department": 1,
      isActive: 1,
    })
      .sort({ lastName: 1 })
      .populate("allocation.position", "name")
      .populate("allocation.department", "name")
      .populate("allocation.workingLocation", "name");

    res.json({
      status: true,
      employees,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Erro ao listar funcionários",
      error: error.message,
    });
  }
};
