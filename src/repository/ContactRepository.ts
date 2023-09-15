import axios from "axios";
import {
  IContact,
  IContactProps,
  IFindContact,
  IContactsData,
} from "../interfaces/IContact";

import { notFound, paramsError } from "../service/errors/errors";
import { config } from "../consts/consts";
import { FieldCode } from "../enums/Codes";
import { ILeads } from "../interfaces/ILeads";

export class ContactRepository implements IContact {
  createLeads(leads: ILeads[]): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const createLeadsAPI = "https://bonav30287.amocrm.ru/api/v4/leads";
      axios
        .post(createLeadsAPI, leads, config)
        .then((data) => {
          return resolve(data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }
  get(params: IFindContact): Promise<IContactProps[]> {
    return new Promise<IContactProps[]>(async (resolve, reject) => {
      // Если оба поля равны undefined
      if (params.email === undefined && params.phone === undefined) {
        return reject(paramsError);
      }

      // Если длина = 2 значит ищем по 2-м параметрам
      const contacts: IContactProps[] = [];

      // Получаем все контакты, и ищем нужного нам пользователя
      await this.getContacts().then((data) => {
        // Переводим полученный ответ в IContactsData
        // полученные контакты перебираем
        const contactData = data.data as IContactsData;
        contactData._embedded?.contacts?.forEach(async (e) => {
          // Тут мы проверяем поля

          let eqCount = 0;

          await e.custom_fields_values?.forEach((fieldValue) => {
            switch (fieldValue.field_code) {
              case FieldCode.EMAIL: {
                // Если ищем по email
                // params.phone === undefined нужна для 3 варианта если мы ищем по номеру и email
                if (params.email !== undefined && params.phone === undefined) {
                  if (fieldValue.values[0].value === params.email) {
                    contacts.push(e);
                  }
                } else {
                  if (fieldValue.values[0].value === params.email) {
                    eqCount++;
                  }
                }
                break;
              }
              case FieldCode.PHONE: {
                // Если ищем по телефону
                if (params.phone !== undefined && params.email === undefined) {
                  if (fieldValue.values[0].value === params.phone) {
                    contacts.push(e);
                  }
                } else {
                  if (fieldValue.values[0].value === params.phone) {
                    eqCount++;
                  }
                }
                break;
              }
            }
          });

          // Равенство по 2-м параметрам
          if (eqCount === 2) {
            contacts.push(e);
          }
        });
      });

      return contacts.length > 0 ? resolve(contacts) : reject(notFound);
    });
  }
  update(contactInfo: IContactProps): Promise<IContactsData | any> {
    return new Promise<IContactsData | any>((resolve, reject) => {
      const updateContactAPI = `https://bonav30287.amocrm.ru/api/v4/contacts/${contactInfo.id}`;
      axios
        .patch(updateContactAPI, contactInfo, config)
        .then((data) => {
          return resolve(data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }
  create(contactInfo: IContactProps[]): Promise<IContactsData | any> {
    return new Promise<IContactsData | any>((resolve, reject) => {
      const createContactAPI = "https://bonav30287.amocrm.ru/api/v4/contacts";
      axios
        .post(createContactAPI, contactInfo, config)
        .then((data) => {
          return resolve(data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }
  getByID(id: number): Promise<IContactProps> {
    return new Promise<IContactProps>((resolve, reject) => {});
  }
  getContacts(): Promise<IContactsData | any> {
    return new Promise<IContactsData | any>((resolve, reject) => {
      const getContactsAPI = "https://bonav30287.amocrm.ru/api/v4/contacts";
      axios
        .get(getContactsAPI, config)
        .then((data) => {
          return resolve(data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }
}
