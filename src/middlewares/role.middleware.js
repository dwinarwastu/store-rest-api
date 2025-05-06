import User from "../user/user.model.js";
import Role from "../user/role.model.js";
import Permission from "../user/permission.model.js";
import { ForbiddenError, NotFoundError } from "../utils/error.js";

export const checkPermission =
  (...permissions) =>
  async (req, res, next) => {
    try {
      const user = await User.findById(req.user.userId).populate({
        path: "roleId",
        populate: {
          path: "permission",
          model: "Permission",
        },
      });

      if (!user) {
        throw new NotFoundError("User not found");
      }

      const userPermissions = user.roleId.permission.map((item) => item.name);

      const hasPermission = permissions.some((item) =>
        userPermissions.includes(item)
      );

      if (!hasPermission) {
        throw new ForbiddenError("Forbidden: Access denied");
      }

      next();
    } catch (error) {
      if (error) {
        next(error);
      }
    }
  };
