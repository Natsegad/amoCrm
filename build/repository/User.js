"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
// This is test
class UserRepository {
    create(user) {
        return new Promise((resolve, reject) => {
            return reject(user);
        });
    }
}
exports.UserRepository = UserRepository;
