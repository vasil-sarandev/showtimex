import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

export const swaggerRouter = Router();

const swaggerDocument = YAML.load('./openapi.yaml');
swaggerRouter.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
