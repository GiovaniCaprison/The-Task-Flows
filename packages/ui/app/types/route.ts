import { SvgIconProps } from '@mui/material/SvgIcon';
import { ComponentType } from 'react';
import { IndexRouteObject, NonIndexRouteObject } from 'react-router-dom';

/**
 * Represents our route's metadata
 */
export interface RouteMetadata {
  /**
   * The title of the page associated with this route
   */
  readonly title: string;

  /**
   * A description of the page associated with this route
   */
  readonly description: string;

  /**
   * The icon component used to represent the page associated with this route.
   */
  readonly Icon: ComponentType<SvgIconProps>;
}

/**
 * Represents an index route.
 */
export interface IndexRoute extends IndexRouteObject {
  readonly handle: RouteMetadata;
}

/**
 * Represents a non-index route.
 */
export interface NonIndexRoute extends NonIndexRouteObject {
  readonly path: string;
  readonly handle: RouteMetadata;
  readonly children?: Route[];
}

/**
 * Represents a custom route in our application with React-Router's `handle` feature set to use with our specific route metadata.
 */
export type Route = IndexRoute | NonIndexRoute;
