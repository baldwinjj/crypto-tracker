import {ITransaction} from "./ITransaction";

export interface ICalculatedTransaction extends ITransaction {
  price: number;
  fiat: number;
}
