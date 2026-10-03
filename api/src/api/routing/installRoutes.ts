import { Application, Router }           from 'express';
import { Container, inject, injectable } from 'inversify';
// TODO: extract
import * as multer                       from 'multer';
import 'reflect-metadata';
import { ROUTE_META_DATA_KEY }                                           from '../../common/constants';
import { keys }                                                          from '../../container/inversify.keys';
import { RouteHandler }                                                  from './routeHandler';
import { IWebRouteController, IWebRouteDecoratorMetaData, WebRouteType } from './webRouteDecorator';

const upload = multer({ dest: '/tmp' });

@injectable()
export class InstallRoutes {
  @inject(RouteHandler)
  private router: RouteHandler;

  @inject(keys.Container)
  private container: Container;

  /**
   * Resolves all controllers and register all routes marked with {@link WebRouteDecorator}
   */
  public installRouters(app: Application): void {

    const webControllers: IWebRouteController[] = this.container.getAll<IWebRouteController>(keys.Controller);

    webControllers.forEach((controller) => {
      const metaDataList: IWebRouteDecoratorMetaData[] =
              Reflect.getOwnMetadata(ROUTE_META_DATA_KEY, controller.constructor);

      const router = Router();

      metaDataList.forEach((metadata: IWebRouteDecoratorMetaData) => {

        console.debug(`Registering route [${metadata.webRouteType}]: ${metadata.route}`);

        switch (metadata.webRouteType) {
          case WebRouteType.GET:
            router.get(metadata.route, (req, res, next) =>
              this.router.routeHandler(controller[metadata.handlerName].bind(controller), metadata, req, res, next));
            break;

          case WebRouteType.POST:
            router.post(metadata.route, (req, res, next) =>
              this.router.routeHandler(controller[metadata.handlerName].bind(controller), metadata, req, res, next));
            break;

          case WebRouteType.PUT:
            router.put(metadata.route, (req, res, next) =>
              this.router.routeHandler(controller[metadata.handlerName].bind(controller), metadata, req, res, next));
            break;

          case WebRouteType.DELETE:
            router.delete(metadata.route, (req, res, next) =>
              this.router.routeHandler(controller[metadata.handlerName].bind(controller), metadata, req, res, next));
            break;

          case WebRouteType.UPLOAD:
            // eslint-disable-next-line no-case-declarations,@typescript-eslint/no-non-null-assertion
            const fieldNames = metadata.webRouteOptions!.uploadOptions!.uploadFormFields;
            router.post(metadata.route, upload.fields(fieldNames.map((x) => ({ name: x }))), (req, res, next) =>
              this.router.routeHandler(controller[metadata.handlerName].bind(controller), metadata, req, res, next));
            break;

          default:
            throw new Error('Unknown WebRouteType ' + metadata.webRouteType);
        }

      });

      app.use(router);
    });
  }
}
