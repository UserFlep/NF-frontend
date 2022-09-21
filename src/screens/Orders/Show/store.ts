import { makeAutoObservable } from "mobx";
import { SingleOrder } from "~/screens/Orders/Show/types";
import client from "~/api/gql";
import {ORDER_QUERY} from "~/screens/Orders/Show/queries";
import {createBrowserHistory, History} from "history";

export default class OrdersShowStore {
  order: SingleOrder | null = null;
  id: string | null = null;
  loading: boolean = false;
  initialized: boolean = false;
  history: History;

  constructor() {
    makeAutoObservable(this);
    this.history = createBrowserHistory();
  }

  startLoading(): void {
    this.loading = true;
  }

  stopLoading(): void {
    this.loading = false;
  }

  get itemsExist(){
    return this.order?.items && this.order.items.length > 0;
  }

  setId(id: string) {
    this.id = id;
  }

  setOrder(order: SingleOrder): void {
    this.order = order;
  }

  setInitialized(val: boolean) {
    this.initialized = val;
  }

  async loadOrder() {
    this.startLoading();
    await client
        .query(ORDER_QUERY, { number: this.id })
        .toPromise()
        .then(res => {
          const {order} = res.data;
          this.setOrder(order);
        })
    this.stopLoading();
  }

  initialize(id: string) {
    if (this.initialized) return;
    this.setId(id);
    this.loadOrder();
    this.setInitialized(true);
  }
}
