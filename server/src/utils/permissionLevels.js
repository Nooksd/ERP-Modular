export const PermissionLevels = {
  NONE: 0,
  VIEWER: 1,
  EDITOR: 2,
  ADMIN: 3,
};

export const PermissionLabels = {
  [PermissionLevels.NONE]: "none",
  [PermissionLevels.VIEWER]: "viewer",
  [PermissionLevels.EDITOR]: "editor",
  [PermissionLevels.ADMIN]: "admin",
};

export const getPermissionLevel = (label) => {
  return PermissionLevels[label.toUpperCase()] || 4;
};
