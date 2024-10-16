import { z } from 'zod';

import { environmentVariables, procedure } from '../helpers';

export const region = procedure('GetRegion')
    .input(z.undefined())
    .query(() => environmentVariables.region);