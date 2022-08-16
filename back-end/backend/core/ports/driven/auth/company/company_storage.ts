import { CompanyDTO } from "./company_dto";

export interface CompanyStorage {
    add: (company:CompanyDTO)=>void
}