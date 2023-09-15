"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
// This is test class
class Entity {
    constructor(props, id) {
        this._id = id ? id : '';
        this.props = props;
    }
}
exports.Entity = Entity;
