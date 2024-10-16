import { createRouter } from '../helpers';
import { rum } from './rum';
import { region } from './region';

export const rootRouter = createRouter({
    rum,
    region,
})