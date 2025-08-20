import { getPermissionLevel } from "../utils/permissionLevels.js";
// import logger from "../utils/logger.js";

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

    // logger.warn("Tentativa de acesso negada", {
    //   userId: user._id,
    //   module,
    //   requiredRole,
    //   userGlobalPermission: user.globalPermission,
    //   modulePermissions: user.modulePermissions,
    // });

    return res.status(403).json({ error: "Acesso negado" });
  };
}

export default checkModulePermission;
