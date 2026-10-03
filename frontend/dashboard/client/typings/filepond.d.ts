declare module 'filepond-plugin-image-exif-orientation' {
}
declare module 'filepond-plugin-image-preview' {
}
declare module 'filepond-plugin-image-resize' {
}
declare module 'filepond-plugin-image-transform' {
}
declare module 'filepond-plugin-image-crop' {
}
declare module 'filepond-plugin-image-edit' {
}
declare module 'filepond-plugin-file-validate-type' {
}
declare module 'filepond-plugin-image-validate-size' {
}

declare module 'filepond' {
  export type TypeFile = {
    id: string;
    serverId: string;
    origin: string;
    status: string;
    file: any;
    fileExtension: string;
    fileSize: string;
    filename: string;
    filenameWithoutExtension: string;

    getMetadata(): any;

    setMetadata(): void;

    abortLoad(): void;

    abortProcessing(): void;
  };
}

declare module 'react-filepond' {

  import { ComponentClass } from 'react';

  export const FilePond: ComponentClass<any>;
  export const File: ComponentClass<any>;

  export function registerPlugin(...args: any[]): void;

  export function setOptions(...args: any[]): void;
}
