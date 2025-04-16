import { defineStore } from 'pinia';

export interface DialogState {
  isOpen: boolean;
  isConfirm: boolean;
  data: any;
  onClose: Function | null;
  onConfirm: Function | null;
}

export const useDialogStore = defineStore('dialog', {
  state: (): DialogState => ({
    isOpen: false,
    isConfirm: false,
    data: null,
    onClose: null,
    onConfirm: null,
  }),
  actions: {
    openDialog(data: any = null) {
      this.isOpen = true;
      this.isConfirm = false;
      this.data = data;
      this.onClose = data.onClose || null;
      this.onConfirm = null;
    },
    openDialogConfirm(data: any = null) {
      this.isOpen = true;
      this.isConfirm = true;
      this.data = data;
      this.onClose = data.onClose  || null;
      this.onConfirm = data.onConfirm || null;
    },
    confirmDialog(result: any = null) {
      this.isOpen = false;
      if (this.onConfirm) {
        this.onConfirm(result);
        this.onConfirm = null;
      }
      this.data = null;
    },
    closeDialog(result: any = null) {
      this.isOpen = false;
      if (this.onClose) {
        this.onClose(result);
        this.onClose = null;
      }
      this.data = null;
    },
  },
  getters: {
    isDialogOpen: (state: DialogState) => state.isOpen,
    isDialogConfirm: (state: DialogState) => state.isConfirm,
    dialogData: (state: DialogState) => state.data,
  },
});