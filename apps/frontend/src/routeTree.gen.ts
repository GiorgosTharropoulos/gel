/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as HomeImport } from './routes/home'
import { Route as IndexImport } from './routes/index'
import { Route as HomeRegionIdImport } from './routes/home.$regionId'

// Create/Update Routes

const HomeRoute = HomeImport.update({
  id: '/home',
  path: '/home',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const HomeRegionIdRoute = HomeRegionIdImport.update({
  id: '/$regionId',
  path: '/$regionId',
  getParentRoute: () => HomeRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/home': {
      id: '/home'
      path: '/home'
      fullPath: '/home'
      preLoaderRoute: typeof HomeImport
      parentRoute: typeof rootRoute
    }
    '/home/$regionId': {
      id: '/home/$regionId'
      path: '/$regionId'
      fullPath: '/home/$regionId'
      preLoaderRoute: typeof HomeRegionIdImport
      parentRoute: typeof HomeImport
    }
  }
}

// Create and export the route tree

interface HomeRouteChildren {
  HomeRegionIdRoute: typeof HomeRegionIdRoute
}

const HomeRouteChildren: HomeRouteChildren = {
  HomeRegionIdRoute: HomeRegionIdRoute,
}

const HomeRouteWithChildren = HomeRoute._addFileChildren(HomeRouteChildren)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/home': typeof HomeRouteWithChildren
  '/home/$regionId': typeof HomeRegionIdRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/home': typeof HomeRouteWithChildren
  '/home/$regionId': typeof HomeRegionIdRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/home': typeof HomeRouteWithChildren
  '/home/$regionId': typeof HomeRegionIdRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/home' | '/home/$regionId'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/home' | '/home/$regionId'
  id: '__root__' | '/' | '/home' | '/home/$regionId'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  HomeRoute: typeof HomeRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  HomeRoute: HomeRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/home"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/home": {
      "filePath": "home.tsx",
      "children": [
        "/home/$regionId"
      ]
    },
    "/home/$regionId": {
      "filePath": "home.$regionId.tsx",
      "parent": "/home"
    }
  }
}
ROUTE_MANIFEST_END */
