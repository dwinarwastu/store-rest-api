import {
  loginService,
  logoutService,
  refreshTokenService,
  registerService,
  updateRoleService,
  updateUserService,
} from "./user.service.js";

export const register = async (req, res) => {
  const register = await registerService(req);

  res.status(200).json({
    message: "Registration success",
    data: register,
  });
};

export const login = async (req, res) => {
  const login = await loginService(req);

  res.status(200).json({
    message: "Login successfullly",
    data: login,
  });
};

export const logout = async (req, res) => {
  await logoutService(req);

  res.status(200).json({
    message: "Logout successfully",
  });
};

export const refreshToken = async (req, res) => {
  const refreshToken = await refreshTokenService(req);

  res.status(200).json({
    message: "New access token generate",
    refreshToken,
  });
};

export const updateUser = async (req, res) => {
  const update = await updateUserService(req);

  res.status(200).json({
    message: "Update user successfully",
    data: update,
  });
};

export const updateRole = async (req, res) => {
  const update = await updateRoleService(req);

  res.status(200).json({
    message: "Successfully update role",
    data: update,
  });
};
