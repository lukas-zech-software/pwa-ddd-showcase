// eslint-disable-next-line max-classes-per-file
class WindowService {
  public get location(): Location {
    return window.location;
  }
}

class DummyWindowService implements WindowService {
  public get location(): Location {
    return {
      origin: '',
    } as Location;
  }
}

export const windowService =
               typeof window !== 'undefined'
                 ? new WindowService()
                 : new DummyWindowService();
