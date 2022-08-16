import { CreateAccountRequest } from "../../ports/driver/auth/create-acount/create_account_request";
import { CreateAccountResponse } from "../../ports/driver/auth/create-acount/create_account_response";
import { ErrorResponse } from "../../ports/driver/error/error_response";
import { UseCase } from "../../_common/use-case";


export interface OpenAccountInject {
    listAllEmployees: ListAllEmployees;
  }
  
  export const listEmployeesUseCase: UseCase<CreateAccountRequest, CreateAccountResponse, ErrorResponse, OpenAccountInject> = async (request, presenter, inject) => {
    const allEmployees = await inject.listAllEmployees();
    if (allEmployees.status === 'error') { return presenter.presentFail(undefined); }
  
    return presenter.presentSuccess(allEmployees.data);
  };