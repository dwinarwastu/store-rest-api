import RefreshToken from "./refreshToken.model.js";
import Role from "./role.model.js";
import User from "./user.model.js";

export const createUserRepository = async (data) => {
  const newUser = new User(data);
  return await newUser.save();
};

export const findOneUserByUsernameRepository = async (username) => {
  return await User.findOne({ username: username });
};

export const createRefreshTokenRepository = async (refreshToken) => {
  const newRefreshToken = new RefreshToken({ refreshToken: refreshToken });
  return await newRefreshToken.save();
};

export const findOneAndUpdateUserRepository = async (refreshTokenId) => {
  return await User.findOneAndUpdate(
    { refreshTokenId: refreshTokenId },
    { $pull: { refreshTokenId: refreshTokenId } },
    { new: true }
  );
};

export const findOneRefreshTokenRepository = async (refreshToken) => {
  return await RefreshToken.findOne({ refreshToken: refreshToken }).select(
    "_id"
  );
};

export const findOneUserByRefreshTokenIdRepository = async (refreshTokenId) => {
  return await User.findOne({ refreshTokenId: refreshTokenId });
};

export const findByIdAndUpdateRefreshTokenRepository = async (
  refreshTokenId,
  newRefreshToken
) => {
  return await RefreshToken.findByIdAndUpdate(refreshTokenId, {
    refreshToken: newRefreshToken,
  });
};

export const findByIdAndUpdateUserRepository = async (userId, data) => {
  return await User.findByIdAndUpdate(userId, data, { new: true });
};

export const findOneAndUpdateUserRoleRepository = async (userId, roleId) => {
  return await User.findByIdAndUpdate(
    { _id: userId },
    { roleId: roleId },
    { new: true }
  ).populate("roleId", "name");
};

export const findOneRoleRepository = async (name) => {
  return await Role.findOne({ name: name });
};
