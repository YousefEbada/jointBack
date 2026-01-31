import { UserModel } from "../models/UserModel.js";
export const UserRepoMongo = {
    async findByEmailOrPhone(contactType, contact) {
        console.log("Finding user by", contactType, ":", contact);
        return UserModel.findOne({ [contactType]: contact });
    },
    async findById(id) {
        return UserModel.findById(id);
    },
    async save(user) {
        console.log("Saving user to MongoDB...", user._doc._id);
        console.log("\n =-=-=-= User data to save:", user._doc);
        const userModel = await UserModel.findById(user._doc._id);
        console.log("Saving user to MongoDB...", userModel);
        if (!userModel)
            return null;
        Object.assign(userModel, user);
        await userModel.save();
        console.log("User saved in MongoDB:", userModel);
        return userModel;
    },
    async create(user) {
        const userModel = new UserModel({ ...user });
        await userModel.save();
        return userModel;
    },
    async updateUserStatus(userId, statusUpdate) {
        console.log("Updating user status in MongoDB...", statusUpdate);
        const updatedUser = await UserModel.findOneAndUpdate({ _id: userId }, { $set: { userStatus: { ...statusUpdate } } }, { new: true });
        console.log("User status updated in MongoDB", updatedUser);
    },
    async updateUserInfo(userId, updateData) {
        console.log("Updating user info in MongoDB...", updateData);
        const updatedUser = await UserModel.findOneAndUpdate({ _id: userId }, { $set: { ...updateData } }, { new: true });
        console.log("User info updated in MongoDB", updatedUser);
        return updatedUser;
    },
    async updateUserRole(userId, newRole) {
        console.log("Updating user role in MongoDB...", newRole);
        const updatedUser = await UserModel.findOneAndUpdate({ _id: userId }, { $set: { role: newRole } }, { new: true });
        console.log("User role updated in MongoDB", updatedUser);
        return updatedUser;
    }
};
