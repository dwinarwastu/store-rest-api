import bcrypt from "bcryptjs";
import {
  createRefreshTokenRepository,
  createUserRepository,
  findOneRoleRepository,
  findOneUserByUsernameRepository,
  findOneRefreshTokenRepository,
  findOneAndUpdateUserRepository,
  findOneUserByRefreshTokenIdRepository,
  findByIdAndUpdateRefreshTokenRepository,
  findByIdAndUpdateUserRepository,
  findOneAndUpdateUserRoleRepository,
} from "./user.repository.js";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../../utils/error.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../../utils/jwt.js";

async function getRoleId() {
  let role = await findOneRoleRepository("user");
  return role ? role._id : null;
}

export const registerService = async (req) => {
  const { username, password, email } = req.body;
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  const roleId = await getRoleId();

  const data = {
    username: username,
    password: hashedPassword,
    email: email,
    roleId: roleId,
    outletId: null,
  };

  const user = await createUserRepository(data);
  if (!user) throw new InternalServerError("Registration failed");

  return user;
};

export const loginService = async (req) => {
  const user = await findOneUserByUsernameRepository(req.body.username);
  if (!user) throw new NotFoundError("Sorry, user not found");

  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isMatch) throw new BadRequestError("Wrong password");

  const payload = {
    userId: user._id,
    username: user.username,
    email: user.email,
    roleId: user.roleId,
    outletId: user.outletId,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const saveRefreshToken = await createRefreshTokenRepository(refreshToken);
  if (!saveRefreshToken)
    throw new InternalServerError("Save refresh token failed");

  user.refreshTokenId.push(saveRefreshToken._id);
  await user.save();

  if (!user) throw new InternalServerError("Refresh token failed");

  const data = {
    userId: user._id,
    username: user.username,
    email: user.email,
    roleId: user.roleId,
    outletId: user.outletId,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };

  return data;
};

export const logoutService = async (req) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new BadRequestError("No refresh token provider");

  const refreshTokenDoc = await findOneRefreshTokenRepository(refreshToken);
  if (!refreshTokenDoc)
    throw new InternalServerError("Refresh token not found");

  const userRemoveToken = await findOneAndUpdateUserRepository(
    refreshTokenDoc._id
  );
  if (!userRemoveToken)
    throw new InternalServerError("Failed delete refresh token in user");

  const removeRefreshToken = await refreshTokenDoc.deleteOne();
  if (!removeRefreshToken)
    throw new InternalServerError(
      "Failed remove refresh token in refresh token"
    );

  return true;
};

export const refreshTokenService = async (req) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new BadRequestError("Refresh token needed");

  const isValid = verifyToken(refreshToken, process.env.REFRESH_TOKEN);
  if (!isValid) throw new InternalServerError("Invalid or expired token");

  const refreshTokenId = await findOneRefreshTokenRepository(refreshToken);
  if (!refreshTokenId) throw new NotFoundError("Refresh token not found");

  const user = await findOneUserByRefreshTokenIdRepository(refreshTokenId);

  const payload = {
    userId: user._id,
    username: user.username,
    email: user.email,
    roleId: user.roleId,
    outletId: user.outletId,
  };

  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  const updatedRefreshToken = await findByIdAndUpdateRefreshTokenRepository(
    refreshTokenId,
    newRefreshToken
  );
  if (!updatedRefreshToken)
    throw new InternalServerError("Updated refresh token failed");

  const data = {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };

  return data;
};

export const updateUserService = async (req) => {
  const isUser = req.user;
  if (!isUser) throw new NotFoundError("User not found");

  const user = req.body;
  if (!user) throw new BadRequestError("Required user");

  const updateUser = await findByIdAndUpdateUserRepository(isUser.userId, user);
  if (!updateUser) throw new InternalServerError("Updated user failed");

  return updateUser;
};

export const updateRoleService = async (req) => {
  const roleId = await findOneRoleRepository("admin");

  const role = await findOneAndUpdateUserRoleRepository(
    req.user.userId,
    roleId._id
  );
  if (!role) throw new InternalServerError("Failed update role");

  return role;
};
