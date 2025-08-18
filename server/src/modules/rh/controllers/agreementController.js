import Agreement from "../models/agreementModel.js";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../../uploads/rh/agreements");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Nenhum documento enviado",
        status: false,
      });
    }

    const fileName = `${uuidv4()}${path.extname(req.file.originalname)}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, req.file.buffer);

    res.status(200).json({
      message: "Documento salvo com sucesso",
      status: true,
      document: {
        filename: fileName,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: `/agreement/document/${fileName}`,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao salvar documento",
      status: false,
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
        message: "Documento não encontrado",
        status: false,
      });
    }

    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao recuperar documento",
      status: false,
      error: error.message,
    });
  }
};

export const createAgreement = async (req, res) => {
  try {
    const { title, document } = req.body;

    if (!title || !document) {
      return res.status(400).json({
        message: "Título e documento são obrigatórios",
        status: false,
      });
    }

    const newAgreement = new Agreement({
      title,
      document,
    });

    await newAgreement.save();

    res.status(201).json({
      message: "Acordo criado com sucesso",
      status: true,
      agreement: newAgreement,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Erro de validação",
        errors,
        status: false,
      });
    }

    res.status(500).json({
      message: "Erro ao criar acordo",
      status: false,
      error: error.message,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const agreements = await Agreement.find().sort({ createdAt: -1 });
    res.json({
      status: true,
      agreements,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao listar acordos",
      status: false,
      error: error.message,
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const agreement = await Agreement.findById(req.params.agreementId);
    if (!agreement) {
      return res.status(404).json({
        message: "Acordo não encontrado",
        status: false,
      });
    }

    res.json({
      status: true,
      agreement,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao recuperar acordo",
      status: false,
      error: error.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    const { title, document } = req.body;
    const agreement = await Agreement.findById(req.params.agreementId);

    if (!agreement) {
      return res.status(404).json({
        message: "Acordo não encontrado",
        status: false,
      });
    }

    if (document && agreement.document && agreement.document.filename) {
      const oldFilePath = path.join(uploadDir, agreement.document.filename);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    agreement.title = title || agreement.title;
    agreement.document = document || agreement.document;
    agreement.updatedAt = new Date();

    await agreement.save();

    res.json({
      message: "Acordo atualizado com sucesso",
      status: true,
      agreement,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Erro de validação",
        errors,
        status: false,
      });
    }

    res.status(500).json({
      message: "Erro ao atualizar acordo",
      status: false,
      error: error.message,
    });
  }
};

export const disable = async (req, res) => {
  try {
    const agreement = await Agreement.findByIdAndUpdate(
      req.params.agreementId,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );
    if (!agreement)
      return res.status(404).json({ message: "Termo não encontrado" });
    res.json({ message: "Termo desativado", agreement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const enable = async (req, res) => {
  try {
    const agreement = await Agreement.findByIdAndUpdate(
      req.params.agreementId,
      { isActive: true, updatedAt: new Date() },
      { new: true }
    );
    if (!agreement)
      return res.status(404).json({ message: "Termo não encontrado" });
    res.json({ message: "Termo ativado", agreement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOne = async (req, res) => {
  try {
    const agreement = await Agreement.findByIdAndDelete(req.params.agreementId);

    if (!agreement) {
      return res.status(404).json({
        message: "Acordo não encontrado",
        status: false,
      });
    }

    if (agreement.document && agreement.document.filename) {
      const filePath = path.join(uploadDir, agreement.document.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.json({
      message: "Acordo excluído com sucesso",
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao excluir acordo",
      status: false,
      error: error.message,
    });
  }
};
