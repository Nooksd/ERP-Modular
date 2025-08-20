import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    employees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
      },
    ],
    managers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    metadata: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

teamSchema.index({ department: 1 });
teamSchema.index({ managers: 1 });
teamSchema.index({ employees: 1 });
teamSchema.index({ isActive: 1 });

teamSchema.methods.canManagerHandle = function (managerId, employeeId) {
  const isManager = this.managers.some((manager) => manager.equals(managerId));
  const hasEmployee = this.employees.some((employee) =>
    employee.equals(employeeId)
  );

  return isManager && hasEmployee && this.isActive;
};

teamSchema.methods.addEmployee = function (employeeId) {
  if (!this.employees.includes(employeeId)) {
    this.employees.push(employeeId);
  }
};

teamSchema.methods.removeEmployee = function (employeeId) {
  this.employees = this.employees.filter((id) => !id.equals(employeeId));
};

export default mongoose.model("Team", teamSchema);
