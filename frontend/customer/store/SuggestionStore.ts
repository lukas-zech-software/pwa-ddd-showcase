import { action, computed, observable } from 'mobx';
import { Suggestion }                   from 'react-places-autocomplete';

export class SuggestionStore {
  @observable
  private _currentSuggestions: readonly Suggestion[] = [];

  @observable
  private _isLoading = false;

  @computed
  public get isLoading(): boolean {
    return this._isLoading;
  }

  @computed
  public get currentSuggestions(): readonly Suggestion[] {
    return Array.from(this._currentSuggestions.values());
  }

  @computed
  public get SuggestionItemProps(): Function {
    return this._suggestionItemProps;
  }

  @action
  public setCurrentSuggestions(
    value: readonly Suggestion[],
    getSuggestionItemProps: Function,
  ): void {
    this._currentSuggestions = value;
    this._suggestionItemProps = getSuggestionItemProps;
  }

  @action
  public setLoading(value: boolean): void {
    this._isLoading = value;
  }

  @action
  public reset(): void {
    this._currentSuggestions = [];
  }

  @observable
  private _suggestionItemProps: Function = () => void 0
}

export const suggestionStore = new SuggestionStore();
