import express from "express";
import dotenv from "dotenv";
import { HttpStatusCode } from "axios";

import { contactUsecase } from "./global/Global";
import {
  IContactProps,
  IContactsData,
  IFindContact,
} from "./interfaces/IContact";
import {
  errValidationPhone,
  errValidationEmail,
  errValidationName,
} from "./service/errors/errors";
import { FieldCode } from "./enums/Codes";
import { ILeads } from "./interfaces/ILeads";

// Загрузка .env переменных
dotenv.config();

// Порт на котором запущен сервер
const port = process.env.PORT;

// Инициализация express
const app = express();

// Контроллеры
app.get("/get", async (req, res) => {
  try {
    let updatedContacs: IContactsData[] = [];
    let contanctLeads: ILeads[] = [];
    // Получаем параметры поиска
    const { email, name, phone }: any = req.query;

    // Валидация полей
    const validate = (email: string, phone: string, name: string): string => {
      const phoneNumberRegex = /^(\+7|8)[0-9]{10}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const stringRegex = /^[A-Za-zА-Яа-я\s]+$/;

      if (email !== undefined) {
        if (!emailRegex.test(email)) {
          return errValidationEmail;
        }
      }
      if (phone !== undefined) {
        // Номер должен начинаться с 8..........
        if (!phoneNumberRegex.test(phone)) {
          return errValidationPhone;
        }
      }
      if (name !== undefined) {
        if (!stringRegex.test(name)) {
          return errValidationName;
        }
      }

      return "ok";
    };

    const validateResult = validate(email, phone, name);
    if (validateResult !== "ok") {
      res.send(validateResult);
      res.status(HttpStatusCode.BadRequest).end();
      return;
    }

    // Поиск контакта
    const contact = await contactUsecase.get({
      email: email,
      phone: phone,
    }).catch((err)=>{

    });

    // Если такого нет то ...
    if (contact === undefined) {
      const createdContact = await contactUsecase.create({
        name: name,
        email: email,
        phone: phone,
      }) as any;

      res.json(createdContact.data);
      res.status(HttpStatusCode.Created).end();
      return;
    }

    // Получаем ФИ
    const [first_name, last_name] = name.split(" ");

    // Обновление данных
    for (let props of contact) {
      props.name = name;
      props.first_name = first_name;
      props.last_name = last_name;

      const updatedData = (await contactUsecase.update(props)) as any;
      contanctLeads.push({
        name: "Test lead",
        created_by: props.responsible_user_id,
        price: 228,
      });
    }

    const createdLeads = await contactUsecase.createLeads(contanctLeads);
    res.json(createdLeads.data);
    res.status(HttpStatusCode.Ok).end();
    return;
  } catch (e: any) {
    console.log(e);
    res.send(e);
    res.status(401).end();
    return;
  }
});

// Прослушивание порта
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
