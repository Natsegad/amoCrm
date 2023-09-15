import { ILeads } from "./ILeads";

export interface ICustomFieldsValue {
  field_id?: number;
  field_name?: string;
  field_code?: string;
  field_type?: string;
  values: [
    {
      value?: string;
      enum_id?: number;
      enum_code?: string;
    }
  ];
}
//..........................................................................
// Объект контактов больше, но так как эта информация
// в данной задаче не нужна я не стал писать все польностью
//..........................................................................
export interface IContactProps {
  id?: number;
  name?: string;
  first_name?: string;
  last_name?: string;
  responsible_user_id?: number;
  custom_fields_values: ICustomFieldsValue[];
}

export interface IEmbeddedProps {
  contacts: IContactProps[];
}

// Коллекция контактов
export interface IContactsData {
  _page?: number;
  _links: Object;
  _embedded: IEmbeddedProps;
}

export interface IContact {
  // Получаем контакты по ID
  getByID(id: number): Promise<IContactProps>;
  // Получение контактов по E-Mail или Номеру телефона
  get(params: IFindContact): Promise<IContactProps[]>;
  // Получение всех контактов
  getContacts(): Promise<IContactsData>;
  // Создание контакта
  create(contactInfo: IContactProps[]): Promise<IContactsData>;
  // Обновляет данные о контакте
  update(contactInfo: IContactProps): Promise<IContactsData>;
  // Создание сделки
  createLeads(leads: ILeads[]): Promise<any>;
}

// Интерфейс для поиска контакта
export interface IFindContact {
  // ----------------------------------
  // Name добавлена не для поиска
  name?: string;
  // ----------------------------------

  phone?: string;
  email?: string;
}
