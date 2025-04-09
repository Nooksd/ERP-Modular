import Page from "../Models/pagesModel.js";

class PageController {
  static async createPage(req, res) {
    try {
      if (!req.user.user.isManager) {
        return res.status(403).json({
          message: "Sem permissão",
          status: false,
        });
      }

      const { title, path } = req.body;

      if (!title || !path) {
        return res.status(400).json({
          message: "Todos campos são obrigatórios",
          status: false,
        });
      }

      const isUnique = await Page.isUnique(path);

      if (!isUnique) {
        return res.status(409).json({
          message: "Página já cadastrada",
          status: false,
        });
      }

      const newPage = await Page.create({
        title,
        path,
        author: req.user.user._id,
      });

      if (!newPage) {
        return res.status(400).json({
          message: "Erro ao salvar a página",
          status: false,
        });
      }

      res.status(201).json({
        message: "Página criada com sucesso",
        status: true,
        page: newPage,
      });
    } catch (e) {
      res.status(500).json({
        message: "Erro interno do servidor",
        status: false,
      });
    }
  }
  static async getAll(req, res) {
    try {
      if (!req.user.user.isManager) {
        return res.status(403).json({
          message: "Sem permissão",
          status: false,
        });
      }

      const pages = await Page.find().exec();

      if (!pages) {
        return res.status(404).json({
          message: "Sem páginas encontradas",
          status: false,
        });
      }

      res.status(200).json({
        message: "Páginas encontradas com sucesso",
        status: true,
        pages,
      });
    } catch (e) {
      res.status(500).json({
        message: "Erro interno do servidor",
        status: false,
      });
    }
  }
}

export default PageController;
