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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = require("axios");
const Global_1 = require("./global/Global");
const errors_1 = require("./service/errors/errors");
// Загрузка .env переменных
dotenv_1.default.config();
// Порт на котором запущен сервер
const port = process.env.PORT;
// Инициализация express
const app = (0, express_1.default)();
// Контроллеры
app.get("/get", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let updatedContacs = [];
        let contanctLeads = [];
        // Получаем параметры поиска
        const { email, name, phone } = req.query;
        // Валидация полей
        const validate = (email, phone, name) => {
            const phoneNumberRegex = /^(\+7|8)[0-9]{10}$/;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const stringRegex = /^[A-Za-zА-Яа-я\s]+$/;
            if (email !== undefined) {
                if (!emailRegex.test(email)) {
                    return errors_1.errValidationEmail;
                }
            }
            if (phone !== undefined) {
                // Номер должен начинаться с 8..........
                if (!phoneNumberRegex.test(phone)) {
                    return errors_1.errValidationPhone;
                }
            }
            if (name !== undefined) {
                if (!stringRegex.test(name)) {
                    return errors_1.errValidationName;
                }
            }
            return "ok";
        };
        const validateResult = validate(email, phone, name);
        if (validateResult !== "ok") {
            res.send(validateResult);
            res.status(axios_1.HttpStatusCode.BadRequest).end();
            return;
        }
        // Поиск контакта
        const contact = yield Global_1.contactUsecase.get({
            email: email,
            phone: phone,
        }).catch((err) => {
        });
        // Если такого нет то ...
        if (contact === undefined) {
            const createdContact = yield Global_1.contactUsecase.create({
                name: name,
                email: email,
                phone: phone,
            });
            res.json(createdContact.data);
            res.status(axios_1.HttpStatusCode.Created).end();
            return;
        }
        // Получаем ФИ
        const [first_name, last_name] = name.split(" ");
        // Обновление данных
        for (let props of contact) {
            props.name = name;
            props.first_name = first_name;
            props.last_name = last_name;
            const updatedData = (yield Global_1.contactUsecase.update(props));
            contanctLeads.push({
                name: "Test lead",
                created_by: props.responsible_user_id,
                price: 228,
            });
        }
        const createdLeads = yield Global_1.contactUsecase.createLeads(contanctLeads);
        res.json(createdLeads.data);
        res.status(axios_1.HttpStatusCode.Ok).end();
        return;
    }
    catch (e) {
        console.log(e);
        res.send(e);
        res.status(401).end();
        return;
    }
}));
// Прослушивание порта
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
