import {
  action,
  computed,
  observable,
} from 'mobx';

export class UiStore {
  @observable
  private _isMapLocationOpen = false;

  @computed
  public get isMapLocationOpen(): boolean {
    return this._isMapLocationOpen;
  }

  @action
  public setIsMapLocationOpen(value: boolean): void {
    this._isMapLocationOpen = value;
  }
}

export const uiStore = new UiStore();
