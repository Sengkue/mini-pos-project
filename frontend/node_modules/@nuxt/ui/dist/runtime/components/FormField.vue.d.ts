import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/form-field';
import type { ComponentConfig } from '../types/utils';
type FormField = ComponentConfig<typeof theme, AppConfig, 'formField'>;
export interface FormFieldProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /** The name of the FormField. Also used to match form errors. */
    name?: string;
    /** A regular expression to match form error names. */
    errorPattern?: RegExp;
    label?: string;
    description?: string;
    help?: string;
    error?: boolean | string;
    hint?: string;
    /**
     * @defaultValue 'md'
     */
    size?: FormField['variants']['size'];
    required?: boolean;
    /** If true, validation on input will be active immediately instead of waiting for a blur event. */
    eagerValidation?: boolean;
    /**
     * Delay in milliseconds before validating the form on input events.
     * @defaultValue `300`
     */
    validateOnInputDelay?: number;
    class?: any;
    ui?: FormField['slots'];
}
export interface FormFieldSlots {
    label(props: {
        label?: string;
    }): any;
    hint(props: {
        hint?: string;
    }): any;
    description(props: {
        description?: string;
    }): any;
    help(props: {
        help?: string;
    }): any;
    error(props: {
        error?: boolean | string;
    }): any;
    default(props: {
        error?: boolean | string;
    }): any;
}
declare const _default: __VLS_WithSlots<import("vue").DefineComponent<FormFieldProps, void, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<FormFieldProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, FormFieldSlots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
