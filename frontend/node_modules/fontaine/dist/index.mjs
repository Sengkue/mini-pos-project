import { parse, walk, generate } from 'css-tree';
import { createRegExp, charIn, exactly, anyOf } from 'magic-regexp';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { fontFamilyToCamelCase } from '@capsizecss/metrics';
import { fromFile, fromUrl } from '@capsizecss/unpack';
import { parseURL } from 'ufo';
import MagicString from 'magic-string';
import { isAbsolute } from 'pathe';
import { createUnplugin } from 'unplugin';

function toPercentage(value, fractionDigits = 4) {
  const percentage = value * 100;
  return `${+percentage.toFixed(fractionDigits)}%`;
}
function toCSS(properties, indent = 2) {
  return Object.entries(properties).map(([key, value]) => `${" ".repeat(indent)}${key}: ${value};`).join("\n");
}
const QUOTES_RE = createRegExp(
  charIn(`"'`).at.lineStart().or(charIn(`"'`).at.lineEnd()),
  ["g"]
);
const withoutQuotes = (str) => str.trim().replace(QUOTES_RE, "");
const genericCSSFamilies = /* @__PURE__ */ new Set([
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui",
  "ui-serif",
  "ui-sans-serif",
  "ui-monospace",
  "ui-rounded",
  "emoji",
  "math",
  "fangsong"
]);
const fontProperties = /* @__PURE__ */ new Set(["font-weight", "font-style", "font-stretch"]);
function parseFontFace(css) {
  const families = [];
  const ast = typeof css === "string" ? parse(css, { positions: true }) : css;
  walk(ast, {
    visit: "Atrule",
    enter(node) {
      if (node.name !== "font-face")
        return;
      let family;
      const sources = [];
      const properties = {};
      if (node.block) {
        walk(node.block, {
          visit: "Declaration",
          enter(declaration) {
            if (declaration.property === "font-family" && declaration.value.type === "Value") {
              for (const child of declaration.value.children) {
                if (child.type === "String") {
                  family = withoutQuotes(child.value);
                  break;
                }
                if (child.type === "Identifier" && !genericCSSFamilies.has(child.name)) {
                  family = child.name;
                  break;
                }
              }
            }
            if (fontProperties.has(declaration.property)) {
              if (declaration.value.type === "Value") {
                for (const child of declaration.value.children) {
                  const hasValue = !!properties[declaration.property];
                  properties[declaration.property] ||= "";
                  properties[declaration.property] += (hasValue ? " " : "") + generate(child);
                }
              }
            }
            if (declaration.property === "src") {
              walk(declaration.value, {
                visit: "Url",
                enter(urlNode) {
                  const source = withoutQuotes(urlNode.value);
                  if (source) {
                    sources.push(source);
                  }
                }
              });
            }
          }
        });
      }
      if (family) {
        for (const source of sources) {
          families.push({ index: node.loc.start.offset, family, source, properties });
        }
        if (!sources.length) {
          families.push({ index: node.loc.start.offset, family, properties });
        }
      }
    }
  });
  return families;
}
function generateFallbackName(name) {
  const firstFamily = withoutQuotes(name.split(",").shift());
  return `${firstFamily} fallback`;
}
function generateFontFace(metrics, fallback) {
  const { name: fallbackName, font: fallbackFontName, metrics: fallbackMetrics, ...properties } = fallback;
  const preferredFontXAvgRatio = metrics.xWidthAvg / metrics.unitsPerEm;
  const fallbackFontXAvgRatio = fallbackMetrics ? fallbackMetrics.xWidthAvg / fallbackMetrics.unitsPerEm : 1;
  const sizeAdjust = fallbackMetrics && preferredFontXAvgRatio && fallbackFontXAvgRatio ? preferredFontXAvgRatio / fallbackFontXAvgRatio : 1;
  const adjustedEmSquare = metrics.unitsPerEm * sizeAdjust;
  const ascentOverride = metrics.ascent / adjustedEmSquare;
  const descentOverride = Math.abs(metrics.descent) / adjustedEmSquare;
  const lineGapOverride = metrics.lineGap / adjustedEmSquare;
  const declaration = {
    "font-family": JSON.stringify(fallbackName),
    "src": `local(${JSON.stringify(fallbackFontName)})`,
    "size-adjust": toPercentage(sizeAdjust),
    "ascent-override": toPercentage(ascentOverride),
    "descent-override": toPercentage(descentOverride),
    "line-gap-override": toPercentage(lineGapOverride),
    ...properties
  };
  return `@font-face {
${toCSS(declaration)}
}
`;
}

const metricCache = {};
function filterRequiredMetrics({ ascent, descent, lineGap, unitsPerEm, xWidthAvg }) {
  return {
    ascent,
    descent,
    lineGap,
    unitsPerEm,
    xWidthAvg
  };
}
async function getMetricsForFamily(family) {
  family = withoutQuotes(family);
  if (family in metricCache)
    return metricCache[family];
  try {
    const name = fontFamilyToCamelCase(family);
    const { entireMetricsCollection } = await import('@capsizecss/metrics/entireMetricsCollection');
    const metrics = entireMetricsCollection[name];
    if (!("descent" in metrics)) {
      metricCache[family] = null;
      return null;
    }
    const filteredMetrics = filterRequiredMetrics(metrics);
    metricCache[family] = filteredMetrics;
    return filteredMetrics;
  } catch {
    metricCache[family] = null;
    return null;
  }
}
const urlRequestCache = /* @__PURE__ */ new Map();
async function readMetrics(_source) {
  const source = typeof _source !== "string" && "href" in _source ? _source.href : _source;
  if (source in metricCache)
    return metricCache[source];
  const { protocol } = parseURL(source);
  if (!protocol)
    return null;
  let metrics;
  if (protocol === "file:") {
    metrics = await fromFile(fileURLToPath(source));
  } else {
    if (urlRequestCache.has(source)) {
      metrics = await urlRequestCache.get(source);
    } else {
      const requestPromise = fromUrl(source);
      urlRequestCache.set(source, requestPromise);
      metrics = await requestPromise;
    }
  }
  const filteredMetrics = filterRequiredMetrics(metrics);
  metricCache[source] = filteredMetrics;
  return filteredMetrics;
}

const supportedExtensions = ["woff2", "woff", "ttf"];
const CSS_RE = createRegExp(
  exactly(".").and(anyOf("sass", "css", "scss")).at.lineEnd()
);
const RELATIVE_RE = createRegExp(
  exactly(".").or("..").and(anyOf("/", "\\")).at.lineStart()
);
const FontaineTransform = createUnplugin((options) => {
  const cssContext = options.css = options.css || {};
  cssContext.value = "";
  const resolvePath = options.resolvePath || ((id) => id);
  const fallbackName = options.fallbackName || options.overrideName || generateFallbackName;
  const skipFontFaceGeneration = options.skipFontFaceGeneration || (() => false);
  function readMetricsFromId(path, importer) {
    const resolvedPath = isAbsolute(importer) && RELATIVE_RE.test(path) ? new URL(path, pathToFileURL(importer)) : resolvePath(path);
    return readMetrics(resolvedPath);
  }
  return {
    name: "fontaine-transform",
    enforce: "pre",
    transformInclude(id) {
      const { pathname } = parseURL(id);
      return CSS_RE.test(pathname) || CSS_RE.test(id);
    },
    async transform(code, id) {
      const s = new MagicString(code);
      const ast = parse(code, { positions: true });
      for (const { family, source, index, properties } of parseFontFace(ast)) {
        if (!supportedExtensions.some((e) => source?.endsWith(e)))
          continue;
        if (skipFontFaceGeneration(fallbackName(family)))
          continue;
        const metrics = await getMetricsForFamily(family) || source && await readMetricsFromId(source, id).catch(() => null);
        if (!metrics)
          continue;
        for (let i = options.fallbacks.length - 1; i >= 0; i--) {
          const fallback = options.fallbacks[i];
          const fallbackMetrics = await getMetricsForFamily(fallback);
          if (!fallbackMetrics)
            continue;
          const fontFace = generateFontFace(metrics, {
            name: fallbackName(family),
            font: fallback,
            metrics: fallbackMetrics,
            ...properties
          });
          cssContext.value += fontFace;
          s.appendLeft(index, fontFace);
        }
      }
      walk(ast, {
        visit: "Declaration",
        enter(node) {
          if (node.property !== "font-family")
            return;
          if (this.atrule && this.atrule.name === "font-face")
            return;
          if (node.value.type !== "Value")
            return;
          for (const child of node.value.children) {
            let family;
            if (child.type === "String") {
              family = withoutQuotes(child.value);
            } else if (child.type === "Identifier" && child.name !== "inherit") {
              family = child.name;
            }
            if (!family)
              continue;
            s.appendRight(child.loc.end.offset, `, "${fallbackName(family)}"`);
            return;
          }
        }
      });
      if (s.hasChanged()) {
        return {
          code: s.toString(),
          /* v8 ignore next 3 */
          map: options.sourcemap ? s.generateMap({ source: id, includeContent: true }) : void 0
        };
      }
    }
  };
});

export { FontaineTransform, generateFallbackName, generateFontFace, getMetricsForFamily, readMetrics };
