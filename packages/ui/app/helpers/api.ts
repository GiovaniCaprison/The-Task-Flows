import { RootRouter } from '@team10/api';
import { createTRPCReact } from '@trpc/react-query';

export const api = createTRPCReact<RootRouter>();
