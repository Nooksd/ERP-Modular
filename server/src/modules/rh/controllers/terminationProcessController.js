import TerminationProcess from "../models/terminationProcessModel.js";
import Employee from "../models/employeeModel.js";

export const create = async (req, res) => {
  try {
    const { employeeId, reason, comment, tempoAvisoPrevio = 0 } = req.body;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        status: false,
        message: "Funcionário não encontrado",
      });
    }

    let steps;

    if (tempoAvisoPrevio === 0) {
      steps = [
        { stepName: "Aviso Prévio", completed: false },
        { stepName: "Devolução de Equipamentos", completed: false },
        { stepName: "Acertos Financeiros", completed: false },
      ];
    } else {
      steps = [
        { stepName: "Devolução de Equipamentos", completed: false },
        { stepName: "Acertos Financeiros", completed: false },
      ];
    }

    const terminationProcess = new TerminationProcess({
      employee: employeeId,
      reason,
      comment,
      tempoAvisoPrevio,

      initiatedAt: new Date(),
      steps,
    });

    employee.status = "aviso prévio";

    await employee.save();
    await terminationProcess.save();

    res.status(201).json({
      status: true,
      message: "Processo de demissão iniciado com sucesso",
      terminationProcess,
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
      message: "Erro ao iniciar processo de demissão",
      error: error.message,
    });
  }
};

export const completeStep = async (req, res) => {
  try {
    const { terminationProcessId, stepName } = req.body;

    const terminationProcess = await TerminationProcess.findOne({
      _id: terminationProcessId,
      status: "andamento",
    });
    if (!terminationProcess) {
      return res.status(404).json({
        status: false,
        message: "Processo de demissão não encontrado",
      });
    }

    const step = terminationProcess.steps.find((s) => s.stepName === stepName);
    if (!step) {
      return res.status(404).json({
        status: false,
        message: "Etapa não encontrada",
      });
    }

    step.completed = true;
    step.completedAt = new Date();

    const allCompleted = terminationProcess.steps.every((s) => s.completed);
    if (allCompleted) {
      const employee = await Employee.findById(terminationProcess.employee);
      if (employee) {
        employee.status = "Desligado";
        employee.isActive = false;
        await employee.save();
      }
      terminationProcess.status = "completo";
      terminationProcess.completedAt = new Date();
    }

    await terminationProcess.save();

    res.status(200).json({
      status: true,
      message: "Etapa concluída com sucesso",
      terminationProcess,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Erro ao concluir etapa",
      error: error.message,
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const { terminationProcessId } = req.params;

    const terminationProcess = await TerminationProcess.findOne({
      _id: terminationProcessId,
      status: "andamento",
    });
    if (!terminationProcess) {
      return res.status(404).json({
        status: false,
        message: "Processo de demissão não encontrado",
      });
    }

    res.status(200).json({
      status: true,
      terminationProcess,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Erro ao buscar processo de demissão",
      error: error.message,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const { employee, status, reason } = req.query;

    const filters = {
      status: "andamento",
    };

    if (employee) {
      filters.employee = employee;
    }

    if (status) {
      filters.status = status;
    }

    if (reason) {
      filters.reason = { $regex: reason, $options: "i" };
    }

    const terminationProcesses = await TerminationProcess.find(filters);
    res.status(200).json({
      status: true,
      terminationProcesses,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Erro ao buscar processos de demissão",
      error: error.message,
    });
  }
};

export const cancel = async (req, res) => {
  try {
    const { terminationProcessId } = req.params;

    const terminationProcess = await TerminationProcess.findOne({
      _id: terminationProcessId,
      status: "andamento",
    });
    if (!terminationProcess) {
      return res.status(404).json({
        status: false,
        message: "Processo de demissão não encontrado",
      });
    }

    const employee = await Employee.findById(terminationProcess.employee);
    if (!employee) {
      return res.status(404).json({
        status: false,
        message: "Funcionário não encontrado",
      });
    }

    employee.status = "Ativo";
    await employee.save();

    terminationProcess.status = "cancelado";
    await terminationProcess.save();

    res.status(200).json({
      status: true,
      message: "Processo de demissão cancelado com sucesso",
      terminationProcess,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Erro ao cancelar processo de demissão",
      error: error.message,
    });
  }
};
