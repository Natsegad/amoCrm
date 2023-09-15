import {
  IContactProps,
  IContactsData,
  IFindContact,
} from "../interfaces/IContact";
import { ILeads } from "../interfaces/ILeads";
import { ContactRepository } from "../repository/ContactRepository";

// Слой usecase для вызова функций для работы с контактами
export class ContactUsecase {
  private _contactRepository: ContactRepository;
  constructor() {
    this._contactRepository = new ContactRepository();
  }

  get(params: IFindContact): Promise<IContactProps[]> {
    return this._contactRepository.get(params);
  }
  update(contactInfo: IContactProps): Promise<IContactsData> {
    return this._contactRepository.update(contactInfo);
  }
  create(contactInfo: IFindContact): Promise<IContactsData> {
    // Получаем из ФИО first_name last_name
    let splited = contactInfo.name?.split(" ");

    let contacts: IContactProps[] = [];
    // Преобразуем данные полученные из параметров в создание нового контакта
    contacts.push({
      name: contactInfo.name,
      first_name: splited?.at(1),
      last_name: splited?.at(0),
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
  getByID(id: number): Promise<IContactProps> {
    return this._contactRepository.getByID(id);
  }
  getContacts(): Promise<IContactsData | any> {
    return this._contactRepository.getContacts();
  }
  createLeads(leads: ILeads[]): Promise<any> {
    return this._contactRepository.createLeads(leads);
  }
}
