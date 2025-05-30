import Predicted from "../Models/predictedModel.js";
import Work from "../Models/workModel.js";
import XLSX from "xlsx";

async function isManagerOnWork(projectId, user) {
  try {
    if (user.isManager) return true;

    const work = await Work.findById(projectId);

    if (!work) return false;

    const isManager = work.managerIds.some((managerId) =>
      managerId.equals(user._id)
    );

    if (!isManager) return false;
    return true;
  } catch (e) {
    return false;
  }
}

const excelDateToJSDate = (excelDate) =>
  new Date(Math.round((excelDate - 25569) * 86400 * 1000));

class PredictedController {
  static async sendPredicted(req, res) {
    try {
      const user = req.user.user;
      const { workId } = req.params;

      if (!req.file) {
        return res.status(400).json({
          message:
            "Nenhum arquivo Excel enviado. Use multipart/form-data key='data'.",
          status: false,
        });
      }

      const canManage = await isManagerOnWork(workId, user);
      if (!canManage) {
        return res.status(403).json({
          message: "Usuário não tem permissão para esta obra.",
          status: false,
        });
      }

      const buffer = req.file.buffer;
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      let rows = jsonData;

      const predictedItems = rows.map((row) => {
        const cellValue = row[0];
        const date = excelDateToJSDate(cellValue);

        return {
          date,
          area: row[1],
          activity: row[2],
          subactivity: row[3],
          role: row[4],
          quantity: Number(row[5]),
          hours: Number(row[7]),
          extras: Number(row[6]),
        };
      });

      let predictedDoc = await Predicted.findOne({ workId });

      if (!predictedDoc) {
        predictedDoc = await Predicted.create({
          workId,
          data: predictedItems,
        });
      } else {
        predictedDoc.data = predictedItems;
        await predictedDoc.save();
      }

      return res.status(201).json({
        message: "Registros Predicted importados com sucesso.",
        predicted: predictedDoc,
        status: true,
      });
    } catch (err) {
      console.error("Erro ao processar Excel:", err);
      return res.status(500).json({
        message: "Erro interno do servidor ao importar Excel.",
        status: false,
      });
    }
  }

  static async getPredicted(req, res) {
    try {
      const user = req.user.user;
      const { workId } = req.params;

      if (!workId) {
        return res.status(400).json({
          message: "O parâmetro workId é obrigatório.",
          status: false,
        });
      }

      const canManage = await isManagerOnWork(workId, user);
      if (!canManage) {
        return res.status(403).json({
          message: "Usuário não tem permissão para esta obra.",
          status: false,
        });
      }

      const predictedDoc = await Predicted.findOne({ workId });
      if (!predictedDoc) {
        return res.status(404).json({
          message: "Nenhum registro de Predicted encontrado para esta obra.",
          status: false,
        });
      }

      return res.status(200).json({
        message: "Predicted encontrado com sucesso.",
        predicted: predictedDoc,
        status: true,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Erro interno do servidor ao buscar Predicted.",
        status: false,
      });
    }
  }

  static async deletePredicted(req, res) {
    try {
      const user = req.user.user;
      const { predictedId } = req.params;

      if (!predictedId) {
        return res.status(400).json({
          message: "O parâmetro predictedId é obrigatório.",
          status: false,
        });
      }

      const predictedDoc = await Predicted.findById(predictedId);
      if (!predictedDoc) {
        return res.status(404).json({
          message: "Documento Predicted não encontrado.",
          status: false,
        });
      }

      const canManage = await isManagerOnWork(predictedDoc.workId, user);
      if (!canManage) {
        return res.status(403).json({
          message: "Usuário não tem permissão para excluir este registro.",
          status: false,
        });
      }

      await Predicted.findByIdAndDelete(predictedId);

      return res.status(200).json({
        message: "Predicted excluído com sucesso.",
        status: true,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Erro interno do servidor ao excluir Predicted.",
        status: false,
      });
    }
  }
}

export default PredictedController;
