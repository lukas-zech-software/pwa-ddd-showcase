import * as bodyParser   from 'body-parser';
import * as compression  from 'compression';
import * as cors         from 'cors';
import * as express      from 'express';
import 'reflect-metadata';
import { HEALT_BASE }    from '../../common/routes/ApiRoutes';
import { InstallRoutes } from './api/routing/installRoutes';
import { setup }         from './container/inversify.config';
import { keys }          from './container/inversify.keys';

process.env.NODE_ENV = process.env.NODE_ENV || 'develop';

const applicationRoot = __dirname;
const container       = setup(applicationRoot);

const port = container.get(keys.ApiPort);

export const app = express();

app.disable('x-powered-by');
app.disable('etag');
app.disable('query parser');
app.disable('views');

// enable body parsing
app.use(bodyParser.json());
app.use(cors({
               credentials: true,
               origin:      true,
             }));
app.use(compression({ threshold: 1024 * 50 }));
const installRoutes = container.get<InstallRoutes>(InstallRoutes);
installRoutes.installRouters(app);

container.get<() => void>(keys.InitFn)();

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is listening at http://localhost:${port}`);
});

// Add k8 health route
app.get(HEALT_BASE, (req, res) => res.status(200).end());

process.on('unhandledRejection', (reason) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled Promise Rejection: [%o]', reason);
  throw reason;
});

process.on('uncaughtException', (error) => {
  // eslint-disable-next-line no-console
  console.error('Uncaught Exception: [%o] - [%s]', error, error.stack);
  process.exit(1);
});
