import { IPaymentType } from "./payment";
import { IMessages } from "./checkout";

type EmptyState = {
  paymentTypes: IPaymentType[];
  messages: null;
  isFetchingPaymentTypes: boolean;
  isFetchingSettings: boolean;
};
type FilledState = {
  paymentTypes: IPaymentType[];
  messages: IMessages;
  isFetchingPaymentTypes: boolean;
  isFetchingSettings: boolean;
};
export type ISettingsState = EmptyState & FilledState;
