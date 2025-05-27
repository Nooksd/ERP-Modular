import Slider from "../Models/sliderModel.js";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

class SliderController {
  static async createSlider(req, res) {
    try {
      if (!req.user.user.isManager) {
        return res.status(403).json({
          message: "Sem permissão",
          status: false,
        });
      }

      const existingSlider = await Slider.findOne();
      if (existingSlider) {
        return res.status(400).json({
          message: "Já existe um slider cadastrado",
          status: false,
        });
      }

      const slider = new Slider({
        items: req.body.items,
      });

      await slider.save();

      res.status(201).json({
        message: "Slider criado com sucesso",
        status: true,
        slider: slider,
      });
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        const errors = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({
          message: "Erro de validação",
          errors: errors,
          status: false,
        });
      }

      res.status(500).json({
        message: "Erro interno do servidor",
        status: false,
      });
    }
  }

  static async getSlider(req, res) {
    try {
      const slider = await Slider.findOne();

      if (!slider) {
        return res.status(404).json({
          message: "Nenhum slider encontrado",
          status: false,
        });
      }

      res.status(200).json({
        message: "Slider obtido com sucesso",
        status: true,
        slider,
      });
    } catch (error) {
      res.status(500).json({
        message: "Erro interno do servidor",
        status: false,
      });
    }
  }

  static async deleteUnusedImages(removedLinks) {
    removedLinks.forEach((link) => {
      const imagePath = path.join(uploadDir, link);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });
  }

  static async updateSlider(req, res) {
    try {
      if (!req.user.user.isManager) {
        return res.status(403).json({
          message: "Sem permissão",
          status: false,
        });
      }

      const slider = await Slider.findOne();
      if (!slider) {
        return res.status(404).json({
          message: "Slider não encontrado",
          status: false,
        });
      }

      const oldImageLinks = slider.items
        .filter((item) => item.type === "image")
        .map((item) => item.link);
      const newImageLinks = req.body.items
        .filter((item) => item.type === "image")
        .map((item) => item.link);
      const removedLinks = oldImageLinks.filter(
        (link) => !newImageLinks.includes(link)
      );

      slider.items = req.body.items;
      await slider.save();

      await this.deleteUnusedImages(removedLinks);

      res.status(200).json({
        message: "Slider atualizado com sucesso",
        status: true,
        slider,
      });
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        const errors = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({
          message: "Erro de validação",
          errors: errors,
          status: false,
        });
      }

      res.status(500).json({
        message: "Erro interno do servidor",
        status: false,
      });
    }
  }

  static async sendImage(req, res) {
    try {
      if (!req.user.user.isManager) {
        return res.status(403).json({
          message: "Sem permissão",
          status: false,
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "Nenhuma imagem enviada",
          status: false,
        });
      }

      const fileName = `${uuidv4()}${path.extname(req.file.originalname)}`;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, req.file.buffer);

      res.status(200).json({
        message: "Imagem salva com sucesso",
        status: true,
        fileName,
      });
    } catch (error) {
      res.status(500).json({
        message: "Erro interno do servidor",
        status: false,
      });
    }
  }

  static async getImage(req, res) {
    try {
      const { fileName } = req.body;
      const imagePath = path.join(uploadDir, fileName);

      if (!fs.existsSync(imagePath)) {
        return res.status(404).json({
          message: "Imagem não encontrada",
          status: false,
        });
      }

      res.sendFile(imagePath);
    } catch (error) {
      res.status(500).json({
        message: "Erro interno do servidor",
        status: false,
      });
    }
  }
}

export default SliderController();
