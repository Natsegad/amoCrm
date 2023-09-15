"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactRepository = void 0;
const axios_1 = __importDefault(require("axios"));
const errors_1 = require("../service/errors/errors");
const consts_1 = require("../consts/consts");
const Codes_1 = require("../enums/Codes");
class ContactRepository {
    createLeads(leads) {
        return new Promise((resolve, reject) => {
            const createLeadsAPI = "https://bonav30287.amocrm.ru/api/v4/leads";
            axios_1.default
                .post(createLeadsAPI, leads, consts_1.config)
                .then((data) => {
                return resolve(data);
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    get(params) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            // Если оба поля равны undefined
            if (params.email === undefined && params.phone === undefined) {
                return reject(errors_1.paramsError);
            }
            // Если длина = 2 значит ищем по 2-м параметрам
            const contacts = [];
            // Получаем все контакты, и ищем нужного нам пользователя
            yield this.getContacts().then((data) => {
                var _a, _b;
                // Переводим полученный ответ в IContactsData
                // полученные контакты перебираем
                const contactData = data.data;
                (_b = (_a = contactData._embedded) === null || _a === void 0 ? void 0 : _a.contacts) === null || _b === void 0 ? void 0 : _b.forEach((e) => __awaiter(this, void 0, void 0, function* () {
                    // Тут мы проверяем поля
                    var _c;
                    let eqCount = 0;
                    yield ((_c = e.custom_fields_values) === null || _c === void 0 ? void 0 : _c.forEach((fieldValue) => {
                        switch (fieldValue.field_code) {
                            case Codes_1.FieldCode.EMAIL: {
                                // Если ищем по email
                                // params.phone === undefined нужна для 3 варианта если мы ищем по номеру и email
                                if (params.email !== undefined && params.phone === undefined) {
                                    if (fieldValue.values[0].value === params.email) {
                                        contacts.push(e);
                                    }
                                }
                                else {
                                    if (fieldValue.values[0].value === params.email) {
                                        eqCount++;
                                    }
                                }
                                break;
                            }
                            case Codes_1.FieldCode.PHONE: {
                                // Если ищем по телефону
                                if (params.phone !== undefined && params.email === undefined) {
                                    if (fieldValue.values[0].value === params.phone) {
                                        contacts.push(e);
                                    }
                                }
                                else {
                                    if (fieldValue.values[0].value === params.phone) {
                                        eqCount++;
                                    }
                                }
                                break;
                            }
                        }
                    }));
                    // Равенство по 2-м параметрам
                    if (eqCount === 2) {
                        contacts.push(e);
                    }
                }));
            });
            return contacts.length > 0 ? resolve(contacts) : reject(errors_1.notFound);
        }));
    }
    update(contactInfo) {
        return new Promise((resolve, reject) => {
            const updateContactAPI = `https://bonav30287.amocrm.ru/api/v4/contacts/${contactInfo.id}`;
            axios_1.default
                .patch(updateContactAPI, contactInfo, consts_1.config)
                .then((data) => {
                return resolve(data);
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    create(contactInfo) {
        return new Promise((resolve, reject) => {
            const createContactAPI = "https://bonav30287.amocrm.ru/api/v4/contacts";
            axios_1.default
                .post(createContactAPI, contactInfo, consts_1.config)
                .then((data) => {
                return resolve(data);
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    getByID(id) {
        return new Promise((resolve, reject) => { });
    }
    getContacts() {
        return new Promise((resolve, reject) => {
            const getContactsAPI = "https://bonav30287.amocrm.ru/api/v4/contacts";
            axios_1.default
                .get(getContactsAPI, consts_1.config)
                .then((data) => {
                return resolve(data);
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
}
exports.ContactRepository = ContactRepository;
