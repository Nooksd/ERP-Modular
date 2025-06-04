import { getPermissionLevel } from "../utils/permissionLevels.js";

function checkModulePermission(module, requiredRole) {
  return (req, res, next) => {
    const user = req.user.user;

    const requiredLevel = getPermissionLevel(requiredRole);

    if (user.globalPermission >= requiredLevel) {
      return next();
    }

    const modulePermission = user?.modulePermissions.find(
      (perm) => perm.module === module
    );

    if (modulePermission && modulePermission.access >= requiredLevel) {
      return next();
    }

    return res.status(403).json({ error: "Acesso negado" });
  };
}

export default checkModulePermission;
