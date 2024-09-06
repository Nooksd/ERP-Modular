import Employee from "../Models/employeesModel.js";

class EmployeeController {
  static getEmployee(req, res) {
    res.json("Hello World!");
  }
  static async createEmployee(req, res) {
    try {
      if (!req.user.user.isManager) {
        return res.status(403).json({
          message: "Sem permissão",
          status: false,
        });
      }

      const { name, cpf, position, department, email, startDate } = req.body;

      if (!name || !cpf || !position || !department) {
        return res.status(400).json({
          message: "Todos os campos são obrigatórios",
          status: false,
        });
      }

      const isUnique = await Employee.isUnique(cpf);

      if (!isUnique) {
        return res.status(409).json({
          message: "Funcionário já cadastrados",
          status: false,
        });
      }

      Employee.create({
        name,
        cpf,
        position,
        department,
        email,
        startDate,
      });

      res.status(201).json({
        message: "Usuário criado com sucesso",
        status: true,
      });
    } catch (e) {
      res.status(500).json({
        message: "Erro interno do servidor " + e.message,
        status: false,
      });
    }
  }
  static getAllEmployees(req, res) {
    res.json("Hello World!");
  }
  static updateEmployee(req, res) {
    res.json("Hello World!");
  }
  static toggleActiviy(req, res) {
    res.json("Hello World!");
  }
  static deleteEmployee(req, res) {
    res.json("Hello World!");
  }
}

export default EmployeeController;
