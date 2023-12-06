import { IShopifyCart } from "./shopify.ts";
import { IAddressObject } from "./delivery";
import { IPayment } from "./payment";

export type ICheckoutState =
  | EmptyState
  | FetchingCartState
  | FetchingCheckoutState
  | FilledState;

export enum ICheckoutStatus {
  CREATED = "CREATED",
  PROCESS = "PROCESS",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
  TO_CANCEL = "TO_CANCEL",
}

export interface ICheckoutContacts {
  email: string;
  phone: string;
  username: string;
  subscribed: boolean;
}

export interface ICheckoutItemImage {
  aspect_ratio: number;
  alt: string;
  height: number;
  width: number;
  url: string;
}
export interface ICheckoutItem {
  count: number;
  price: number;
  discount: number;
  title: string;
  description: string;
  id: number | string;
  compareAtPrice: string;
  inventoryItemId: string;
  variant: {
    size: string;
    image?: ICheckoutItemImage;
    vendor: string;
    productTitle: string;
  };
  variantId: string;
}

export interface ICheckout {
  _id: string;
  id: string;
  status: ICheckoutStatus;
  isClosed: boolean;
  reserved: boolean;
  orderId?: string;
  paymentType?: string;
  payment?: IPayment;
  contacts: ICheckoutContacts;
  items: ICheckoutItem[];
  codes: string[];
  createdAt: string;
  expired: Date;
  updatedAt: string;
}

export type FetchingCartState = EmptyState & {
  isLoading: boolean;
  isFetchingCart: true;
};

export type FetchingCheckoutState = EmptyState & {
  cart: IShopifyCart;
  isLoading: boolean;
  isFetchingCart: false;
  isFetching: true;
};

export type EmptyState = {
  checkout: null;
  cart: null;
  isFetchingCart: boolean;
  isFetching: boolean;
  isLoading: boolean;
  checkoutId: null;
};

export type FilledState = {
  cart: IShopifyCart;
  checkout: ICheckout;
  isFetchingCart: false;
  isFetching: false;
  checkoutId: string;
  isLoading: boolean;
};

export interface IMessages {
  approvedDescriptionText?: string;
  approvedStatusText?: string;
  completedDescriptionText?: string;
  completedStatusText?: string;
  errorDescriptionText?: string;
  errorStatusText?: string;
  expiredDescriptionText?: string;
  expiredStatusText?: string;
  paidDescriptionText?: string;
  paidStatusText?: string;
  noAccountMsg?: string;
  noConfirmedAccountMsg?: string;
  noSegmentMsg?: string;
  otpText?: string;
  otpReSendText?: string;
  otpPlaceholder?: string;
  flashCallPlaceholder?: string;
  flashCallReSendText?: string;
  flashCallSendText?: string;
  emailSend?: string;
  emailPlaceholder?: string;
}

export interface ICheckoutPaymentRequest {
  _id: string;
  payment: string;
  contacts: {
    email: string;
    phone: string;
    username: string;
  };
  delivery: {
    address: string;
    type: string;
    addressObject: IAddressObject;
  };
}
export interface ICheckoutPaymentResponse {
  code: number;
  object: any;
  redirect: string;
}
