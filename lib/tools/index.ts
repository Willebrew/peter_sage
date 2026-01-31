import type { Tool } from '@sage/core/tools';
import { profileTools } from './profile';
import { postTools } from './posts';
import { commentTools } from './comments';
import { votingTools } from './voting';
import { submoltTools } from './submolts';
import { socialTools } from './social';
import { feedTools } from './feed';
import { metaTools } from './meta';

export const allMoltbookTools: Tool[] = [
  ...profileTools,
  ...postTools,
  ...commentTools,
  ...votingTools,
  ...submoltTools,
  ...socialTools,
  ...feedTools,
  ...metaTools,
];
