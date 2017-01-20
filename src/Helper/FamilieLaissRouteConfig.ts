import {RouteConfig, NavModel, NavigationInstruction} from 'aurelia-router';

export class FamilieLaissRouteConfig implements RouteConfig {
  route: string | string[];
  name?: string;
  moduleId?: string;
  redirect?: string;
  navigationStrategy?: (instruction: NavigationInstruction) => Promise<void> | void;
  viewPorts?: any;
  nav?: boolean | number;
  href?: string;
  generationUsesHref?: boolean;
  title?: string;
  settings?: any;
  navModel?: NavModel;
  caseSensitive?: boolean;
  activationStrategy?: string;
  userGroups?: Array<string>;
  [x: string]: any;
}
