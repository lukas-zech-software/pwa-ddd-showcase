import { Omit }           from '@material-ui/core';
import { IGlobalMessage } from '../types';

class GlobalMessageService {
  private messages: IGlobalMessage[] = [];

  public setHandler(handler: () => void): void {
    this.handler = handler;
  }

  public pushMessage(message: Omit<IGlobalMessage, 'id'>): void {
    this.messages.push({ id: Date.now().toString(), ...message });

    if (this.handler) {
      this.handler();
    }
  }

  public hasMessages(): boolean {
    return this.messages.length !== 0;
  }

  public getMessage(): IGlobalMessage | undefined {
    return this.messages.shift();
  }

  private handler: () => void = () => void 0;

}

export const globalMessageService = new GlobalMessageService();
