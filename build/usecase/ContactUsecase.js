"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactUsecase = void 0;
const ContactRepository_1 = require("../repository/ContactRepository");
// Слой usecase для вызова функций для работы с контактами
class ContactUsecase {
    constructor() {
        this._contactRepository = new ContactRepository_1.ContactRepository();
    }
    get(params) {
        return this._contactRepository.get(params);
    }
    update(contactInfo) {
        return this._contactRepository.update(contactInfo);
    }
    create(contactInfo) {
        var _a;
        // Получаем из ФИО first_name last_name
        let splited = (_a = contactInfo.name) === null || _a === void 0 ? void 0 : _a.split(" ");
        let contacts = [];
        // Преобразуем данные полученные из параметров в создание нового контакта
        contacts.push({
            name: contactInfo.name,
            first_name: splited === null || splited === void 0 ? void 0 : splited.at(1),
            last_name: splited === null || splited === void 0 ? void 0 : splited.at(0),
            custom_fields_values: [
                {
                    field_name: "Телефон",
                    field_code: "PHONE",
                    field_type: "multitext",
                    values: [
                        {
                            value: contactInfo.phone,
                        },
                    ],
                },
                {
                    field_name: "Email",
                    field_code: "EMAIL",
                    field_type: "multitext",
                    values: [
                        {
                            value: contactInfo.email,
                        },
                    ],
                },
            ],
        });
        return this._contactRepository.create(contacts);
    }
    getByID(id) {
        return this._contactRepository.getByID(id);
    }
    getContacts() {
        return this._contactRepository.getContacts();
    }
    createLeads(leads) {
        return this._contactRepository.createLeads(leads);
    }
}
exports.ContactUsecase = ContactUsecase;
