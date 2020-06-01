import RootStore from "./rootStore";
import { observable, action } from "mobx";

export default class ModalStore {
  rootStore: RootStore

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
  }

  //observable objects are observed as deep by default, here we want it shallow

  @observable.shallow modal = {
    isOpen: false,
    body: null
  }

  @action openModal = (content: any) => {
    this.modal.isOpen = true
    this.modal.body = content
  }

  @action closeModal = () => {
    this.modal.isOpen = false
    this.modal.body = null
  }
}