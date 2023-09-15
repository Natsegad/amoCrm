"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUseCase = void 0;
const User_1 = require("../repository/User");
const User_2 = require("../domain/User");
class UserUseCase {
    constructor() {
        this._userRepository = new User_1.UserRepository();
    }
    create() {
        var _a;
        let user = {
            id: "asd",
            name: "asd",
            age: 1,
        };
        return (_a = this._userRepository) === null || _a === void 0 ? void 0 : _a.create(new User_2.User(user));
    }
}
exports.UserUseCase = UserUseCase;
