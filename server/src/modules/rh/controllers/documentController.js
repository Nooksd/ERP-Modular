import Document from "../models/documentModel.js";
import RequiredDocument from "../models/requiredDocumentModel.js";
import Employee from "../models/employeeModel.js";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../../../uploads/rh/documents");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const uploadDocumentFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: "Nenhum arquivo enviado",
      });
    }

    const fileName = `${uuidv4()}${path.extname(req.file.originalname)}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, req.file.buffer);

    res.status(200).json({
      status: true,
      message: "Arquivo salvo com sucesso",
      document: {
        filename: fileName,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: `/document/file/${fileName}`,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Erro ao salvar arquivo",
      error: error.message,
    });
  }
};

export const getDocument = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(uploadDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        status: false,
        message: "Arquivo não encontrado",
      });
    }

    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Erro ao obter arquivo",
      error: error.message,
    });
  }
};

export const createOrUpdateDocument = async (req, res) => {
  try {
    const { employeeId, requiredDocumentId, documentData } = req.body;

    let existingDoc = await Document.findOne({
      employee: employeeId,
      requiredDocument: requiredDocumentId,
    });

    if (existingDoc) {
      existingDoc.document.push({
        ...documentData,
        uploadedAt: new Date(),
        isExpired: false,
      });

      if (req.body.expirationTime) {
        existingDoc.expirationTime = existingDoc.expirationTime || 0;
      }

      existingDoc.status = "enviado";
      existingDoc.updatedAt = new Date();

      await existingDoc.save();

      return res.json({
        status: true,
        message: "Nova versão do documento adicionada",
        document: existingDoc,
      });
    }

    const requiredDocument = await RequiredDocument.findById(
      requiredDocumentId
    );
    if (!requiredDocument) {
      return res.status(404).json({
        status: false,
        message: "Documento obrigatório não encontrado",
      });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        status: false,
        message: "Funcionário não encontrado",
      });
    }

    const newDocument = new Document({
      title: requiredDocument.title,
      employee: employeeId,
      requiredDocument: requiredDocumentId,
      document: [
        {
          ...documentData,
          uploadedAt: new Date(),
          isExpired: false,
        },
      ],
      expirationTime: requiredDocument.expirationTime || 0,
      status: "enviado",
    });

    await newDocument.save();

    res.status(201).json({
      status: true,
      message: "Documento criado com sucesso",
      document: newDocument,
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
      message: "Erro ao salvar documento",
      error: error.message,
    });
  }
};

export const requestDocument = async (req, res) => {
  try {
    const { employeeId, title, expirationTime } = req.body;

    const newDocument = new Document({
      title: title,
      employee: employeeId,
      expirationTime: expirationTime || 0,
      isRequested: true,
      status: "vazio",
    });

    await newDocument.save();

    res.status(201).json({
      status: true,
      message: "Documento criado com sucesso",
      document: newDocument,
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
      message: "Erro ao salvar documento",
      error: error.message,
    });
  }
};

export const sendRequestedDocument = async (req, res) => {
  try {
    const documentId = req.params.documentId;

    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: "Nenhum arquivo enviado",
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      employee: req.user.user.employeeId,
      isRequested: true,
      status: "vazio",
    });
    if (!document) {
      return res.status(404).json({
        status: false,
        message: "Documento não encontrado",
      });
    }

    const fileName = `${uuidv4()}${path.extname(req.file.originalname)}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, req.file.buffer);

    document.document.push({
      filename: fileName,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: `/document/file/${fileName}`,
      uploadedAt: new Date(),
      isExpired: false,
    });

    document.status = "enviado";
    document.updatedAt = new Date();

    await document.save();

    res.json({
      status: true,
      message: "Documento enviado com sucesso",
      document,
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
      message: "Erro ao salvar documento",
      error: error.message,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const { employee, status, expired } = req.query;
    const filter = {};

    if (employee) filter.employee = employee;
    if (status) filter.status = status;

    if (expired === "true") {
      filter["document.isExpired"] = true;
    } else if (expired === "false") {
      filter["document.isExpired"] = false;
    }

    const documents = await Document.find(filter)
      .populate("employee", "firstName lastName modality")
      .populate("requiredDocument", "title expirationTime")
      .sort({ updatedAt: -1 });

    res.json({
      status: true,
      documents,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Erro ao listar documentos",
      error: error.message,
    });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const documentId = req.params.documentId;

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({
        status: false,
        message: "Documento não encontrado",
      });
    }

    fs.unlinkSync(path.join(uploadDir, document.filename));

    await Document.findByIdAndDelete(documentId);

    res.json({
      status: true,
      message: "Documento deletado com sucesso",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Erro ao deletar documento",
      error: error.message,
    });
  }
};
