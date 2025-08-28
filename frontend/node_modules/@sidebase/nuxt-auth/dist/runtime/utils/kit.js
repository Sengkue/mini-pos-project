import { withoutBase, withoutTrailingSlash } from "ufo";
import { createRouter, toRouteMatcher } from "radix3";
import { useRuntimeConfig } from "#imports";
export function withoutQuery(path) {
  return path.split("?")[0];
}
let routeMatcher;
export function getNitroRouteRules(path) {
  const { nitro, app } = useRuntimeConfig();
  if (!routeMatcher) {
    routeMatcher = toRouteMatcher(
      createRouter({
        routes: Object.fromEntries(
          Object.entries(nitro?.routeRules || {}).map(([path2, rules]) => [withoutTrailingSlash(path2), rules])
        )
      })
    );
  }
  const options = {};
  const matches = routeMatcher.matchAll(
    withoutBase(withoutTrailingSlash(withoutQuery(path)), app.baseURL)
  ).reverse();
  for (const match of matches) {
    options.disableServerSideAuth ??= match.auth?.disableServerSideAuth;
  }
  return options;
}
