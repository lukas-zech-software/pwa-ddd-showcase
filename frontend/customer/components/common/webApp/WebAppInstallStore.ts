import { action, computed, observable } from 'mobx';

export class WebAppInstallStore {
  @observable
  public showAppInstallDialog = false;

  @observable
  public deferredPrompt: any = undefined;

  @computed
  public get isAppInstallPromptAvailable(): boolean {
    return this.deferredPrompt !== undefined;
  }

  @action
  public showDialog(): void {
    this.showAppInstallDialog = true;
  }

  @action
  public setDeferredPrompt(prompt: any): void {
    this.deferredPrompt = prompt;
  }

  public reset(): void {
    this.showAppInstallDialog = false;
    this.deferredPrompt = undefined;
  }
}

export const webAppInstallStore = new WebAppInstallStore();
