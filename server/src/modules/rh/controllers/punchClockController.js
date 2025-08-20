import PunchClock from "../models/punchClockModel.js";
import mongoose from "mongoose";

const IMMUTABLE_FIELDS = ["serialNumber", "model", "manufacturer"];

export const create = async (req, res) => {
  try {
    const equipmentData = req.body;

    const existingEquipment = await PunchClock.findOne({
      serialNumber: equipmentData.serialNumber,
    });

    if (existingEquipment) {
      return res.status(400).json({
        status: false,
        message: "Já existe um equipamento com este número de série",
      });
    }

    const newEquipment = new PunchClock(equipmentData);
    await newEquipment.save();

    res.status(201).json({
      status: true,
      message: "Equipamento criado com sucesso",
      equipment: newEquipment,
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
      message: "Erro ao criar equipamento",
      error: error.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    const equipment = await PunchClock.findById(req.params.equipmentId);

    if (!equipment) {
      return res.status(404).json({
        status: false,
        message: "Equipamento não encontrado",
      });
    }

    const updateData = req.body;

    for (const field of IMMUTABLE_FIELDS) {
      if (
        updateData[field] !== undefined &&
        updateData[field] !== equipment[field]
      ) {
        return res.status(403).json({
          status: false,
          message: `Campo '${field}' é imutável e não pode ser alterado`,
        });
      }
    }

    Object.assign(equipment, updateData);
    equipment.updatedAt = new Date();

    await equipment.save();

    res.json({
      status: true,
      message: "Equipamento atualizado",
      equipment,
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
      message: "Erro ao atualizar equipamento",
      error: error.message,
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const equipment = await PunchClock.findById(req.params.equipmentId);

    if (!equipment) {
      return res.status(404).json({
        status: false,
        message: "Equipamento não encontrado",
      });
    }

    res.json({
      status: true,
      equipment,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Erro ao obter equipamento",
      error: error.message,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const { active, status, query } = req.query;
    const filter = {};

    if (active !== undefined) {
      filter.isActive = active === "true";
    }

    if (status) {
      filter.status = status;
    }

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { serialNumber: { $regex: query, $options: "i" } },
        { model: { $regex: query, $options: "i" } },
        { "connection.ipAddress": { $regex: query, $options: "i" } },
      ];
    }

    const equipment = await PunchClock.find(filter).sort({
      name: 1,
      createdAt: -1,
    });

    res.json({
      status: true,
      equipment,
      count: equipment.length,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Erro ao listar equipamentos",
      error: error.message,
    });
  }
};

export const testConnection = async (req, res) => {
  try {
    const equipment = await PunchClock.findById(req.params.equipmentId);

    if (!equipment) {
      return res.status(404).json({
        status: false,
        message: "Equipamento não encontrado",
      });
    }

    const result = await equipment.testConnection();

    console.log(result);

    if (result.success) {
      res.json({
        status: true,
        message: "Conexão bem-sucedida",
        session: result.session,
      });
    } else {
      res.status(500).json({
        status: false,
        message: "Falha na conexão",
        error: result.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Erro ao testar conexão",
      error: error.message,
    });
  }
};

export const syncPunches = async (req, res) => {
  try {
    const equipment = await PunchClock.findById(req.params.equipmentId);
    const { startDate } = req.body;

    if (!equipment) {
      return res.status(404).json({
        status: false,
        message: "Equipamento não encontrado",
      });
    }

    const result = await equipment.collectPunches(startDate);

    if (result.success) {
      res.json({
        status: true,
        message: "Sincronização realizada com sucesso",
        punches: result.processed,
        count: result.processed.length,
      });
    } else {
      res.status(500).json({
        status: false,
        message: "Falha na sincronização",
        error: result.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Erro ao sincronizar batidas",
      error: error.message,
    });
  }
};

export const deleteOne = async (req, res) => {
  try {
    const equipment = await PunchClock.findByIdAndDelete(
      req.params.punchClockId
    );

    if (!equipment) {
      return res.status(404).json({
        status: false,
        message: "Equipamento não encontrado",
      });
    }

    res.json({
      status: true,
      message: "Equipamento excluído com sucesso",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Erro ao excluir equipamento",
      error: error.message,
    });
  }
};
