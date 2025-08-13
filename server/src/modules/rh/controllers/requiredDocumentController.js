import RequiredDocument from "../models/requiredDocumentModel.js";

export const getAll = async (req, res) => {
  try {
    const activeFilter = req.query.active === "false" ? false : true;
    const employmentTypes = req.query.employmentType
      ? req.query.employmentType.split(",")
      : null;

    const filter = { isActive: activeFilter };

    if (employmentTypes) {
      filter.requiredFor = { $in: employmentTypes };
    }

    const documents = await RequiredDocument.find(filter).sort({ title: 1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOne = async (req, res) => {
  try {
    const document = await RequiredDocument.findById(
      req.params.requiredDocumentId
    );
    if (!document) {
      return res
        .status(404)
        .json({ message: "Documento obrigatório não encontrado" });
    }
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const validEmploymentTypes = [
      "CLT",
      "PJ",
      "Estágio",
      "Aprendiz",
      "Temporário",
    ];

    if (Array.isArray(req.body.requiredFor)) {
      const invalidTypes = req.body.requiredFor.filter(
        (type) => !validEmploymentTypes.includes(type)
      );

      if (invalidTypes.length > 0) {
        return res.status(400).json({
          message: `Tipos de contratação inválidos: ${invalidTypes.join(", ")}`,
          validTypes: validEmploymentTypes,
        });
      }
    } else {
      if (validEmploymentTypes.indexOf(req.body.requiredFor) === -1) {
        return res.status(400).json({
          message: `Tipo de contratação inválido: ${req.body.requiredFor}`,
          validTypes: validEmploymentTypes,
        });
      }
    }

    const newDocument = new RequiredDocument(req.body);
    await newDocument.save();
    res.status(201).json(newDocument);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    if (req.body.requiredFor) {
      const validEmploymentTypes = [
        "CLT",
        "PJ",
        "Estágio",
        "Aprendiz",
        "Temporário",
      ];
      const invalidTypes = req.body.requiredFor.filter(
        (type) => !validEmploymentTypes.includes(type)
      );

      if (invalidTypes.length > 0) {
        return res.status(400).json({
          message: `Tipos de contratação inválidos: ${invalidTypes.join(", ")}`,
          validTypes: validEmploymentTypes,
        });
      }
    }

    const updatedDocument = await RequiredDocument.findByIdAndUpdate(
      req.params.requiredDocumentId,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedDocument) {
      return res
        .status(404)
        .json({ message: "Documento obrigatório não encontrado" });
    }

    res.json(updatedDocument);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const disable = async (req, res) => {
  try {
    const document = await RequiredDocument.findByIdAndUpdate(
      req.params.requiredDocumentId,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );

    if (!document) {
      return res
        .status(404)
        .json({ message: "Documento obrigatório não encontrado" });
    }

    res.json({ message: "Documento desativado", document });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const enable = async (req, res) => {
  try {
    const document = await RequiredDocument.findByIdAndUpdate(
      req.params.requiredDocumentId,
      { isActive: true, updatedAt: new Date() },
      { new: true }
    );

    if (!document) {
      return res
        .status(404)
        .json({ message: "Documento obrigatório não encontrado" });
    }

    res.json({ message: "Documento ativado", document });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOne = async (req, res) => {
  try {
    const deleted = await RequiredDocument.findByIdAndDelete(
      req.params.requiredDocumentId
    );

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Documento obrigatório não encontrado" });
    }

    res.json({ message: "Documento excluído" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
