import { createContext, useContext } from "react";
import client from "api/gql";
import {
  DELIVERY_TYPES_QUERY,
  ORDER_STATUSES_QUERY,
  PRODUCT_STATUSES_QUERY,
} from "~/screens/queries";
import { CrmType } from "~/api/types/crmType";
import { makeAutoObservable } from "mobx";

type Status = null | Promise<any> | true;

export class GlobalState {
  data: {
    orderStatuses: CrmType[];
    deliveryTypes: CrmType[];
    productStatuses: CrmType[];
  } = {
    orderStatuses: [],
    deliveryTypes: [],
    productStatuses: [],
  };

  status: {
    orderStatuses: Status;
    deliveryTypes: Status;
    productStatuses: Status;
  } = {
    orderStatuses: null,
    deliveryTypes: null,
    productStatuses: null,
  };

  constructor() {
    makeAutoObservable(this);
  }

  setOrderStatuses(statuses: CrmType[]) {
    this.data.orderStatuses = statuses;
    this.status.orderStatuses = true;
  }

  setProductStatuses(statuses: CrmType[]) {
    this.data.productStatuses = statuses;
    this.status.productStatuses = true;
  }

  setDeliveryTypes(statuses: CrmType[]) {
    this.data.deliveryTypes = statuses;
    this.status.deliveryTypes = true;
  }

  get orderStatuses() {
    if (this.status.orderStatuses === null) {
      client.query(ORDER_STATUSES_QUERY)
          .toPromise()
          .then(res => {
            this.setOrderStatuses(res.data.orderStatuses)
          })
    }
    return this.data.orderStatuses;
  }

  get productStatuses() {
    if (this.status.productStatuses === null) {
      client.query(PRODUCT_STATUSES_QUERY)
        .toPromise()
        .then(res => {
          this.setProductStatuses(res.data.productStatuses)
        })
    }
    return this.data.productStatuses;
  }

  get deliveryTypes() {
    if (this.status.deliveryTypes === null) {
      client.query(DELIVERY_TYPES_QUERY)
        .toPromise()
        .then(res => {
          this.setDeliveryTypes(res.data.deliveryTypes)
        })
    }
    return this.data.deliveryTypes;
  }
}

export const GlobalStateContext = createContext(new GlobalState());
export const GlobalStateProvider = GlobalStateContext.Provider;

export function useGlobalState() {
  return useContext(GlobalStateContext);
}
