import Employee from "../Models/employeesModel.js";

class EmployeeController {
  static async getEmployee(req, res) {
    try {
      if (!req.user.user.isManager) {
        return res.status(403).json({
          message: "Sem permissão",
          status: false,
        });
      }

      const { employeeId } = req.params;

      const employee = await Employee.findById(employeeId).exec();

      if (!employee) {
        return res.status(404).json({
          message: "Funcionário não encontrado",
          status: false,
        });
      }

      res.status(200).json({
        message: "Funcionário encontrado com sucesso",
        employee,
        status: true,
      });
    } catch (e) {
      res.status(500).json({
        message: "Erro interno do servidor",
        status: false,
      });
    }
  }
  static async createEmployee(req, res) {
    try {
      if (!req.user.user.isManager) {
        return res.status(403).json({
          message: "Sem permissão",
          status: false,
        });
      }

      const { name, cpf, role, email, startDate, managerId } = req.body;

      if (!name || !cpf || !role) {
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
        role,
        email,
        startDate,
        managerId,
      });

      res.status(201).json({
        message: "Funcionário criado com sucesso",
        status: true,
      });
    } catch (e) {
      res.status(500).json({
        message: "Erro interno do servidor " + e.message,
        status: false,
      });
    }
  }
  static async getAllEmployees(req, res) {
    try {
      if (!req.user.user.isManager) {
        return res.status(403).json({
          message: "Sem permissão",
          status: false,
        });
      }

      const {
        page = 1,
        limit = 10000,
        name,
        order = true,
        active = "true",
      } = req.query;

      let filter = name ? { name: { $regex: name, $options: "i" } } : {};

      filter = { ...filter, isActive: active === "true" };

      const sortOrder = order ? 1 : -1;

      const totalEmployees = await Employee.countDocuments(filter);

      const employees = await Employee.find(filter)
        .sort({ ["name"]: sortOrder })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      res.status(200).json({
        message: "Funcionários listados com sucesso",
        employees,
        pagination: {
          totalEmployees,
          totalPages: Math.ceil(totalEmployees / limit),
          currentPage: parseInt(page),
        },
        status: true,
      });
    } catch (e) {
      res.status(500).json({
        message: "Erro interno do servidor",
        status: false,
      });
    }
  }
  static async updateEmployee(req, res) {
    try {
      if (!req.user.user.isManager) {
        return res.status(403).json({
          message: "Sem permissão",
          status: false,
        });
      }

      const { employeeId } = req.params;
      const { name, cpf, email, role, startDate, isActive, managerId } =
        req.body;

      if (
        !name &&
        !email &&
        !cpf &&
        !role &&
        !startDate &&
        isActive !== true &&
        isActive !== false &&
        !managerId
      ) {
        return res.status(400).json({
          message: "Nenhum dado para atualizar",
          status: false,
        });
      }

      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (cpf) updateData.cpf = cpf;
      if (role) updateData.role = role;
      if (startDate) updateData.startDate = new Date(startDate);
      if (isActive === true || isActive === false)
        updateData.isActive = isActive;
      if (managerId && Array.isArray(managerId))
        updateData.managerId = managerId;

      const employee = await Employee.findByIdAndUpdate(
        employeeId,
        {
          $set: updateData,
        },
        { new: true }
      ).exec();

      if (!employee) {
        return res.status(404).json({
          message: "Funcionário não encontrado",
          status: false,
        });
      }

      res.status(200).json({
        message: "Funcionário atualizado com sucesso",
        employee,
        status: true,
      });
    } catch (e) {
      res.status(500).json({
        message: "Erro interno do servidor",
        status: false,
      });
    }
  }
  static async deleteEmployee(req, res) {
    try {
      if (!req.user.user.isManager) {
        return res.status(403).json({
          message: "Sem permissão",
          status: false,
        });
      }
      const { employeeId } = req.params;
      const employee = await Employee.findByIdAndDelete(employeeId).exec();
      if (!employee) {
        return res.status(404).json({
          message: "Funcionário não encontrado",
          status: false,
        });
      }
      res.status(200).json({
        message: "Funcionário excluído com sucesso",
        status: true,
      });
    } catch (e) {
      res.status(500).json({
        message: "Erro interno do servidor",
        status: false,
      });
    }
  }
}

export default EmployeeController;
