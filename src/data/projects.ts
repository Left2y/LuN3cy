// Define a shared data structure to ensure media links are always synced
import { DESIGN_DATA } from './design';
import { DEV_DATA } from './dev';
import { PHOTOGRAPHY_PROJECTS } from './photography_projects';

export const PROJECT_DATA = [
  ...DESIGN_DATA,
  ...PHOTOGRAPHY_PROJECTS,
  ...DEV_DATA
];
