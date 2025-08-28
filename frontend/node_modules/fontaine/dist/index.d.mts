import { Font } from '@capsizecss/unpack';
import * as unplugin from 'unplugin';

/**
 * Generates a fallback name based on the first font family specified in the input string.
 * @param {string} name - The full font family string.
 * @returns {string} - The fallback font name.
 */
declare function generateFallbackName(name: string): string;
interface FallbackOptions {
    /**
     * The name of the fallback font.
     */
    name: string;
    /**
     * The fallback font family name.
     */
    font: string;
    /**
     * Metrics for fallback face calculations.
     * @optional
     */
    metrics?: FontFaceMetrics;
    /**
     * Additional properties that may be included dynamically
     */
    [key: string]: any;
}
type FontFaceMetrics = Pick<Font, 'ascent' | 'descent' | 'lineGap' | 'unitsPerEm' | 'xWidthAvg'>;
/**
 * Generates a CSS `@font-face' declaration for a font, taking fallback and resizing into account.
 * @param {FontFaceMetrics} metrics - The metrics of the preferred font. See {@link FontFaceMetrics}.
 * @param {FallbackOptions} fallback - The fallback options, including name, font and optional metrics. See {@link FallbackOptions}.
 * @returns {string} - The full `@font-face` CSS declaration.
 */
declare function generateFontFace(metrics: FontFaceMetrics, fallback: FallbackOptions): string;

/**
 * Retrieves the font metrics for a given font family from the metrics collection. Uses caching to avoid redundant calculations.
 * @param {string} family - The name of the font family for which metrics are requested.
 * @returns {Promise<FontFaceMetrics | null>} - A promise that resolves with the filtered font metrics or null if not found. See {@link FontFaceMetrics}.
 * @async
 */
declare function getMetricsForFamily(family: string): Promise<FontFaceMetrics | null>;
/**
 * Reads font metrics from a specified source URL or file path. This function supports both local files and remote URLs.
 * It caches the results to optimise subsequent requests for the same source.
 * @param {URL | string} _source - The source URL or local file path from which to read the font metrics.
 * @returns {Promise<FontFaceMetrics | null>} - A promise that resolves to the filtered font metrics or null if the source cannot be processed.
 * @async
 */
declare function readMetrics(_source: URL | string): Promise<FontFaceMetrics | null>;

interface FontaineTransformOptions {
    /**
     * Configuration options for the CSS transformation.
     * @optional
     */
    css?: {
        /**
         * Holds the current value of the CSS being transformed.
         * @optional
         */
        value?: string;
    };
    /**
     * An array of fallback font family names to use.
     */
    fallbacks: string[];
    /**
     * Function to resolve a given path to a valid URL or local path.
     * This is typically used to resolve font file paths.
     * @optional
     */
    resolvePath?: (path: string) => string | URL;
    /**
     * A function to determine whether to skip font face generation for a given fallback name.
     * @optional
     */
    skipFontFaceGeneration?: (fallbackName: string) => boolean;
    /**
     * Function to generate an unquoted font family name to use as a fallback.
     * This should return a valid CSS font family name and should not include quotes.
     * @optional
     */
    fallbackName?: (name: string) => string;
    /** @deprecated use fallbackName */
    overrideName?: (name: string) => string;
    /**
     * Specifies whether to create a source map for the transformation.
     * @optional
     */
    sourcemap?: boolean;
}
/**
 * Transforms CSS files to include font fallbacks.
 *
 * @param options - The transformation options. See {@link FontaineTransformOptions}.
 * @returns The unplugin instance.
 */
declare const FontaineTransform: unplugin.UnpluginInstance<FontaineTransformOptions, boolean>;

export { FontaineTransform, generateFallbackName, generateFontFace, getMetricsForFamily, readMetrics };
export type { FontaineTransformOptions };
