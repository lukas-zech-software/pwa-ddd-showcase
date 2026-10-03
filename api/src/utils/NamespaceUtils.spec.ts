import { NamespaceUtils } from './NamespaceUtils';

describe(NamespaceUtils.resolve(__filename), () => {
  it('should resolve correct file path if in source folder', () => {
    const filename          = '/some/path/to/api-common/with/an/src/folder/and/some/sub/folders/and/a/Class.js',
          expectedNamespace = 'api.common.folder.and.some.sub.folders.and.a.Class';
    expect(NamespaceUtils.resolve(filename)).toBe(expectedNamespace);
  });

  it('should resolve correct file path if in test folder', () => {
    const filename          = '/some/path/to/api-common/with/an/test/folder/and/some/sub/folders/and/a/Class.js',
          expectedNamespace = 'api.common.folder.and.some.sub.folders.and.a.Class';
    expect(NamespaceUtils.resolve(filename)).toBe(expectedNamespace);
  });

  it('should resolve correct file name with multiple "api-XXX" in file path', () => {
    const filename          = '/path/api-common/additional/api-module/and/the/right/api-name/src/folder/Class.js',
          expectedNamespace = 'api.name.folder.Class';
    expect(NamespaceUtils.resolve(filename)).toBe(expectedNamespace);
  });

  it('should resolve correct file for path on target', () => {
    const filename          = '/opt/api/target/src/folder/Class.js',
          expectedNamespace = 'api.target.folder.Class';
    expect(NamespaceUtils.resolve(filename)).toBe(expectedNamespace);
  });

  it('should resolve correct file for path on target with "api-XXX" subfolder', () => {
    const filename          = '/opt/api/target/additional/api-module/and/the/right/api-name/src/folder/Class.js',
          expectedNamespace = 'api.name.folder.Class';
    expect(NamespaceUtils.resolve(filename)).toBe(expectedNamespace);
  });

  it('should return filename if no "api-" is in file path', () => {
    const filename = 'path/without/api';
    expect(NamespaceUtils.resolve(filename)).toBe(filename);
  });

  it('should return filename if no "src" is in file path', () => {
    const filename = 'path/api-common/without/source';
    expect(NamespaceUtils.resolve(filename)).toBe(filename);
  });

  it('should return filename if no "src" after "api-" is in file path', () => {
    const filename = 'path/src/api-common/without/source';
    expect(NamespaceUtils.resolve(filename)).toBe(filename);
  });
});
