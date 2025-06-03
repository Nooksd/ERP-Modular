export const hasModulePermission = (user, moduleName, minLevel) => {
  if (!user || !moduleName) return false;

  if (user.globalPermission >= minLevel) {
    return true;
  }

  const modulePerm = user.modulePermissions.find(
    (perm) => perm.module === moduleName
  );

  return modulePerm?.access >= minLevel;
};

export const hasPagePermission = (user, moduleName, requiredLevel) => {
  return hasModulePermission(user, moduleName, requiredLevel);
};
