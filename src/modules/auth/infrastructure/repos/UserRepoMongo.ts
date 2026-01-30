import { UserRepoPort } from "modules/auth/application/ports/UserRepoPort.js";
import { User } from "modules/auth/domain/User.js";
import { UserModel } from "../models/UserModel.js";

export const UserRepoMongo: UserRepoPort = {
  async findByEmailOrPhone(contactType: string, contact: string): Promise<User | null> {
    console.log("Finding user by", contactType, ":", contact);
    return UserModel.findOne({ [contactType]: contact });
  },

  async findById(id: string): Promise<User | null> {
    return UserModel.findById(id);
  },

  async save(user: Partial<User> | any): Promise<User | null> {
    console.log("Saving user to MongoDB...", user._doc._id);
    console.log("\n =-=-=-= User data to save:", user._doc);
    const userModel = await UserModel.findById(user._doc._id);
    console.log("Saving user to MongoDB...", userModel);
    if (!userModel) return null;
    Object.assign(userModel, user);
    await userModel.save();
    console.log("User saved in MongoDB:", userModel);
    return userModel as any as User;
  },

  async create(user: Partial<User>): Promise<User> {
    const userModel = new UserModel({ ...user });
    await userModel.save();
    return userModel as any as User;
  },

  async updateUserStatus(userId: string, statusUpdate: Partial<User['userStatus']>): Promise<void> {
    console.log("Updating user status in MongoDB...", statusUpdate);
    const updatedUser = await UserModel.findOneAndUpdate({ _id: userId }, { $set: { userStatus: { ...statusUpdate } } }, { new: true });
    console.log("User status updated in MongoDB", updatedUser);
  },

  async updateUserInfo(userId: string, updateData: Partial<User>): Promise<User | null> {
    console.log("Updating user info in MongoDB...", updateData);
    const updatedUser = await UserModel.findOneAndUpdate({ _id: userId }, { $set: { ...updateData } }, { new: true });
    console.log("User info updated in MongoDB", updatedUser);
    return updatedUser as any as User;
  },

  async updateUserRole(userId: string, newRole: User['role']): Promise<User | null> {
    console.log("Updating user role in MongoDB...", newRole);
    const updatedUser = await UserModel.findOneAndUpdate({ _id: userId }, { $set: { role: newRole } }, { new: true });
    console.log("User role updated in MongoDB", updatedUser);
    return updatedUser as any as User;
  }
}
