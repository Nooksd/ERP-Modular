import Employee from "../models/employeeModel.js";
import HiringProcess from "../models/hiringProcessModel.js";
import Candidate from "../models/candidateModel.js";
import RequiredDocument from "../models/requiredDocumentModel.js";
import Document from "../models/documentModel.js";

const checkDocumentationComplete = async (employeeId, modality) => {
  try {
    const requiredDocs = await RequiredDocument.find({
      requiredFor: modality,
      isActive: true,
    });

    const sentDocs = await Document.find({
      employee: employeeId,
      status: "enviado",
    });

    return requiredDocs.every((requiredDoc) =>
      sentDocs.some((sentDoc) =>
        sentDoc.requiredDocument.equals(requiredDoc._id)
      )
    );
  } catch (error) {
    console.error("Erro ao verificar documentos:", error);
    return false;
  }
};

export const create = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({
      _id: req.params.candidateId,
      isActive: true,
    }).populate("appliedIn.job", "modality");
    if (!candidate) {
      return res.status(404).json({
        status: false,
        message: "Candidato não encontrado",
      });
    }

    const modality = candidate.appliedIn.job.modality;

    const steps = [
      { stepName: "Cadastro de Funcionário", completed: false },
      { stepName: "Documentação", completed: false },
    ];
    if (modality === "CLT") {
      steps.push({ stepName: "Cadastro eSocial", completed: false });
    }

    const hiringProcess = new HiringProcess({
      candidate: candidate._id,
      modality,
      steps,
    });

    await hiringProcess.save();

    candidate.isActive = false;
    await candidate.save();

    res.status(201).json({
      status: true,
      message: "Funcionário e processo de contratação criados",
      hiringProcess,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Erro ao criar funcionário",
      error: error.message,
    });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { processId } = req.params;

    const hiringProcess = await HiringProcess.findOne({
      _id: processId,
      status: "andamento",
    });
    if (!hiringProcess) {
      return res.status(404).json({
        status: false,
        message: "Processo de contratação não encontrado",
      });
    }

    const step = hiringProcess.steps.find(
      (s) => s.stepName === "Cadastro de Funcionário"
    );
    if (step.completed) {
      return res.status(400).json({
        status: false,
        message: "Cadastro de Funcionário já concluído",
      });
    }

    const employee = new Employee(req.body);
    await employee.save();

    step.completed = true;
    step.completedAt = new Date();
    hiringProcess.employee = employee._id;

    await hiringProcess.save();

    res.status(201).json({
      status: true,
      message: "Funcionário criado com sucesso",
      employee,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Erro ao criar funcionário",
      error: error.message,
    });
  }
};

export const checkDocuments = async (req, res) => {
  try {
    const { processId } = req.params;

    const hiringProcess = await HiringProcess.findOne({
      _id: processId,
      status: "andamento",
    });
    if (!hiringProcess) {
      return res.status(404).json({
        status: false,
        message: "Processo de contratação não encontrado",
      });
    }

    const step = hiringProcess.steps.find((s) => s.stepName === "Documentação");
    if (step.completed) {
      return res.status(400).json({
        status: false,
        message: "Documentação já concluída",
      });
    }

    const employee = await Employee.findById(hiringProcess.employee);
    if (!employee) {
      return res.status(404).json({
        status: false,
        message: "Funcionário associado não encontrado",
      });
    }

    const docsComplete = await checkDocumentationComplete(
      employee._id,
      employee.modality
    );
    if (!docsComplete) {
      return res.status(400).json({
        status: false,
        message: "Documentação obrigatória incompleta",
      });
    }

    step.completed = true;
    step.completedAt = new Date();

    await hiringProcess.save();

    res.status(200).json({
      status: true,
      message: "Documentação verificada com sucesso",
      hiringProcess,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Erro ao verificar documentos",
      error: error.message,
    });
  }
};

export const sendESocial = async (req, res) => {
  try {
    const { processId } = req.params;
    const { esocial } = req.body;

    if (!esocial || esocial.length < 5) {
      return res.status(400).json({
        status: false,
        message: "Dados do eSocial são obrigatórios",
      });
    }

    const hiringProcess = await HiringProcess.findOne({
      _id: processId,
      status: "andamento",
    });
    if (!hiringProcess) {
      return res.status(404).json({
        status: false,
        message: "Processo de contratação não encontrado",
      });
    }
    const step = hiringProcess.steps.find(
      (s) => s.stepName === "Cadastro eSocial"
    );
    if (step.completed) {
      return res.status(404).json({
        status: false,
        message: "Etapa de cadastro eSocial não encontrada",
      });
    }

    const employee = await Employee.findById(hiringProcess.employee);
    if (!employee) {
      return res.status(404).json({
        status: false,
        message: "Funcionário associado não encontrado",
      });
    }

    employee.esocial = esocial;

    await employee.save();

    step.completed = true;
    step.completedAt = new Date();

    await hiringProcess.save();

    res.status(200).json({
      status: true,
      message: "Dados enviados para o eSocial com sucesso",
      employee,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Erro ao enviar dados para o eSocial",
      error: error.message,
    });
  }
};

export const completeProcess = async (req, res) => {
  try {
    const { processId } = req.params;

    const hiringProcess = await HiringProcess.findOne({
      _id: processId,
      status: "andamento",
    });
    if (!hiringProcess) {
      return res.status(404).json({
        status: false,
        message: "Processo de contratação não encontrado",
      });
    }

    const incompleteStep = hiringProcess.steps.find(
      (s) => s.completed === false
    );
    if (incompleteStep) {
      return res.status(400).json({
        status: false,
        message: "Um ou mais processos estão incompletos",
      });
    }

    const employee = await Employee.findById(hiringProcess.employee);
    if (!employee) {
      return res.status(404).json({
        status: false,
        message: "Funcionário associado não encontrado",
      });
    }

    employee.isActive = true;
    employee.status = "Ativo";
    employee.entryDate = new Date();
    await employee.save();

    hiringProcess.status = "completo";
    hiringProcess.completedAt = new Date();
    await hiringProcess.save();

    res.status(200).json({
      status: true,
      message: "Processo de contratação concluído com sucesso",
      hiringProcess,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Erro ao enviar dados para o eSocial",
      error: error.message,
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const { processId } = req.params;

    const hiringProcess = await HiringProcess.findById(processId).populate(
      "candidate",
      "firstName lastName email phone"
    );

    if (!hiringProcess) {
      return res.status(404).json({
        status: false,
        message: "Processo de contratação não encontrado",
      });
    }

    res.json({
      status: true,
      hiringProcess,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Erro ao obter processo",
      error: error.message,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    const hiringProcesses = await HiringProcess.find(filter)
      .populate("candidate", "firstName lastName")
      .sort({ createdAt: -1 });

    res.json({
      status: true,
      hiringProcesses,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Erro ao listar processos",
      error: error.message,
    });
  }
};

export const cancel = async (req, res) => {
  try {
    const { processId } = req.params;

    const hiringProcess = await HiringProcess.findById(processId);
    if (!hiringProcess) {
      return res.status(404).json({
        status: false,
        message: "Processo de contratação não encontrado",
      });
    }

    if (hiringProcess.status === "Completo") {
      return res.status(400).json({
        status: false,
        message: "Processo já finalizado não pode ser cancelado",
      });
    }

    hiringProcess.status = "Cancelado";
    await hiringProcess.save();

    await Employee.findByIdAndDelete(hiringProcess.employee);
    await Candidate.findByIdAndUpdate(hiringProcess.candidate, {
      isActive: true,
    });

    res.json({
      status: true,
      message: "Processo de contratação cancelado",
      hiringProcess,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Erro ao cancelar processo",
      error: error.message,
    });
  }
};
