/**
 * Utils to work with Namespace
 */
export class NamespaceUtils {
  /**
   * Resolves an given filepath to a java-like full qualified class path</br>
   * e.g '~/workspace/api/common/src/utils/NamespaceUtils.spec.js' </br>
   * will be resolved to 'api.common.utils.NamespaceUtils'
   *
   * @param {string} filename The filename to resolve (a full UNIX-filename including path)
   * @returns {string} The resolved path
   */
  public static resolve(filename: string): string {
    if (/api\/(src|test)/g.test(filename) === true) {
      filename = filename.split('api/').pop() || '';
    } else {
      return filename;
    }

    const path     = filename.split(/src\/|test\//),
          baseName = path[0].split('/')[0];

    let nameSpace = path[1].replace(/(.js|.test.js)/, '');

    nameSpace = nameSpace.replace(/\//g, '.');

    return `api.${baseName}.${nameSpace}`;
  }
}
