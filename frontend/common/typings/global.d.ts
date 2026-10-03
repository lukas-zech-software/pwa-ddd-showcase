/* eslint-disable */
interface Window {
  google: any;
  gtag: any;
  WebFont: any;
}

// https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API
interface Clipboard {
  writeText(newClipText: string): Promise<void>;

  // Add any other methods you need here.
}

interface NavigatorClipboard {
  // Only available in a secure context.
  readonly clipboard?: Clipboard;
}

type ShareOptions = { title: string; text: string; url: string };

type NavigatorShare = (options: ShareOptions) => Promise<{}>;

interface Navigator extends NavigatorClipboard {
  share?: NavigatorShare;
}
