import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
} from "../../utils/jwt.js";
import RefreshToken from "../models/refreshToken.model.js";
import { InternalServerError, NotFoundError } from "../../utils/error.js";
import Role from "../models/role.model.js";
import Outlet from "../models/outlet.model.js";

async function getRoleId() {
    let role = await Role.findOne({ name: "user" });
    return role ? role._id : null;
}

async function getOutletId() {
    let outlet = await Outlet.findOne({ name: "Outlet Malang" });
    return outlet ? outlet._id : null;
}

export const register = async (req, res) => {
    const { username, password, email } = req.body;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const roleId = await getRoleId();
    const outletId = await getOutletId();

    const user = await User.create({
        username: username,
        password: hashedPassword,
        email: email,
        roleId: roleId,
        outletId: null,
    });

    if (!user) {
        throw new InternalServerError("Registration failed");
    }

    res.status(200).json({
        success: true,
        message: "Registration success",
        data: user,
    });
};

export const login = async (req, res) => {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
        throw new NotFoundError("Sorry, user not found");
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
        throw new InternalServerError("Wrong password");
    }

    const payload = {
        userId: user._id,
        username: user.username,
        email: user.email,
        roleId: user.roleId,
        outletId: user.outletId,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const saveRefreshToken = new RefreshToken({
        refreshToken: refreshToken,
    });

    await saveRefreshToken.save();

    if (!saveRefreshToken) {
        throw new InternalServerError("Save refresh token failed");
    }

    user.refreshTokenId.push(saveRefreshToken._id);
    await user.save();

    if (!user) {
        throw new InternalServerError("Refresh token failed");
    }

    res.status(200).json({
        success: true,
        message: "Login successfully",
        data: {
            userId: user._id,
            username: user.username,
            email: user.email,
            roleId: user.roleId,
            outletId: user.outletId,
            accessToken: accessToken,
            refreshToken: refreshToken,
        },
    });
};

export const logout = async (req, res) => {
    // const { refreshToken } = req.body;

    // if (!refreshToken) {
    //     throw new InternalServerError("No refresh token provided");
    // }

    // const refreshTokenDoc = await RefreshToken.findOne({refreshToken: refreshToken});

    // if (!refreshTokenDoc) {
    //     throw new InternalServerError("Refresh token not found");
    // }

    // const user = await User.findOne({refreshTokenId: refreshTokenDoc._id});

    // const userRemoveToken = await User.updateOne({_id: user._id}, {refreshTokenId: []});

    // if (!userRemoveToken) {
    //     throw new InternalServerError("Failed remove refresh token in user");
    // }

    // const removeRefreshtoken = await RefreshToken.deleteMany({_id: {$in: user.refreshTokenId}})

    // if (!removeRefreshtoken) {
    //     throw new InternalServerError("Failed remove refresh token in refresh token");
    // }

    // res.status(200).json({
    //     success: true,
    //     message: "Logout successfully"
    // });

    //tapi semisasal kalo kita login di dua device, terus kita logout di salah satu device maka akan keluar di device yang kita login
    //terlebih dahulu atau kita langsung delete semua refresh token yan ada, tapi minusnya kalo kita logout di satu device maka yang di device
    //lain akan ikut terlogout

    const { refreshToken } = req.body;

    if (!refreshToken) {
        throw new InternalServerError("No refresh token provided");
    }

    const refreshTokenDoc = await RefreshToken.findOne({
        refreshToken: refreshToken,
    });

    if (!refreshTokenDoc) {
        throw new InternalServerError("Refresh token not found");
    }

    const userRemoveToken = await User.findOneAndUpdate(
        { refreshTokenId: refreshTokenDoc._id },
        { $pull: { refreshTokenId: refreshTokenDoc._id } },
        { new: true }
    );

    if (!userRemoveToken) {
        throw new InternalServerError("Failed delete refresh token in user");
    }

    const removeRefreshToken = await refreshTokenDoc.deleteOne();

    if (!removeRefreshToken) {
        throw new InternalServerError(
            "Failed remove refresh token in refresh token"
        );
    }

    res.status(200).json({
        success: true,
        message: "Logout successfully",
    });

    // const { refreshToken } = req.body;

    // if (!refreshToken) {
    //     throw new Error("No refresh token provided");
    // }

    // const user = await User.findOne({refresh_token: refreshToken});

    // if (!user) {
    //     throw new Error("Refresh token not found");
    // }

    // const userId = user._id;

    // const logoutUser = await User.findByIdAndUpdate(userId, {refresh_token: null}, {new: true});

    // if (!logoutUser) {
    //     throw new Error("Logout failed")
    // }

    // res.json({
    //     success: true,
    //     message: "Logout successfully"
    // });
};

export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        throw new InternalServerError("Refresh token needed");
    }

    const isValid = verifyToken(refreshToken, process.env.REFRESH_TOKEN);

    if (!isValid) {
        throw new InternalServerError("Invalid or expired token");
    }

    const refreshTokenId = await RefreshToken.findOne({
        refreshToken: refreshToken,
    }).select("_id");

    if (!refreshTokenId) {
        throw new NotFoundError("Refresh token not found");
    }

    const user = await User.findOne({ refreshTokenId: refreshTokenId });

    const payload = {
        userId: user._id,
        username: user.username,
        email: user.email,
        roleId: user.roleId,
        outletId: user.outletId,
    };

    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    const updatedRefreshToken = await RefreshToken.findByIdAndUpdate(
        refreshTokenId,
        { refreshToken: newRefreshToken }
    );

    if (!updatedRefreshToken) {
        throw new InternalServerError("Updated refresh token failed");
    }

    res.status(200).json({
        success: true,
        message: "New access token generate",
        data: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        },
    });

    // const user = await User.findOne({ refresh_token: refreshToken });

    // if (!user) {
    //     throw new Error("Invalid refresh token");
    // }

    // const isValid = verifyToken(refreshToken);

    // if (!isValid) {
    //     return res.status(403).json({
    //         success: false,
    //         message: "Invalid or expired token"
    //     });
    // }

    // const payload = {
    //     userId: user._id,
    //     username: user.username,
    //     email: user.email,
    //     role: user.role
    // };

    // const newAccessToken = generateAccessToken(payload);
    // const newRefreshToken = generateRefreshToken(payload);

    // user.refreshTokenId = newRefreshToken;
    // await user.save();

    // if (!user) {
    //     return res.status(403).json({
    //         success: false,
    //         message: "Failed refresh token"
    //     });
    // }

    // res.status(200).json({
    //     success: true,
    //     message: "New access token generate",
    //     data: {
    //         accessToken: newAccessToken,
    //         refreshToken: newRefreshToken
    //     }
    // });
};

export const updateUser = async (req, res) => {
    const isUser = req.user;

    if (!isUser) {
        throw new NotFoundError("User not found");
    }

    const user = req.body;

    if (!user) {
        throw new InternalServerError("Required user");
    }

    const updatedUser = await User.findByIdAndUpdate(isUser.userId, user, {
        new: true,
    });

    if (!updatedUser) {
        throw new InternalServerError("Updated user failed");
    }

    return res.status(200).json({
        success: true,
        message: "Updated user successfully",
        data: updatedUser,
    });

    // const {id} = req.params;
    // const user = req.body;

    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //     return res.status(401).json({
    //         success: false,
    //         message: "Invalid user id"
    //     });
    // };

    // const updatedUser = await User.findByIdAndUpdate(id, user, {new: true});

    // if (!updatedUser) {
    //     return error(res, 500, "Updated user failed");
    // };

    // res.status(201).json({
    //     success: true,
    //     message: "Updated user successfully",
    //     data: {
    //         username: updatedUser.username,
    //         email: updatedUser.email,
    //         role: updatedUser.role,
    //         refreshToken: updatedUser.refresh_token
    //     }
    // });
};

export const updateRole = async (req, res) => {
    const roleId = await Role.findOne({ name: "admin" });

    const role = await User.findOneAndUpdate(
        { _id: req.user.userId },
        { roleId: roleId._id },
        { new: true }
    ).populate("roleId", "name");

    if (!role) {
        throw new InternalServerError("Failed update role");
    }

    res.status(200).json({
        success: true,
        message: "Successfully update role",
        data: role,
    });
};
