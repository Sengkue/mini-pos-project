import type { FormSchema, FormError, FormInputEvents, FormErrorEvent, FormSubmitEvent, Form, InferInput, FormData } from '../types/form';
export interface FormProps<S extends FormSchema, T extends boolean = true> {
    id?: string | number;
    /** Schema to validate the form state. Supports Standard Schema objects, Yup, Joi, and Superstructs. */
    schema?: S;
    /** An object representing the current state of the form. */
    state: Partial<InferInput<S>>;
    /**
     * Custom validation function to validate the form state.
     * @param state - The current state of the form.
     * @returns A promise that resolves to an array of FormError objects, or an array of FormError objects directly.
     */
    validate?: (state: Partial<InferInput<S>>) => Promise<FormError[]> | FormError[];
    /**
     * The list of input events that trigger the form validation.
     * @remarks The form always validates on submit.
     * @defaultValue `['blur', 'change', 'input']`
     */
    validateOn?: FormInputEvents[];
    /** Disable all inputs inside the form. */
    disabled?: boolean;
    /**
     * Delay in milliseconds before validating the form on input events.
     * @defaultValue `300`
     */
    validateOnInputDelay?: number;
    /**
     * If true, schema transformations will be applied to the state on submit.
     * @defaultValue `true`
     */
    transform?: T;
    /**
     * If true, this form will attach to its parent Form (if any) and validate at the same time.
     * @defaultValue `true`
     */
    attach?: boolean;
    /**
     * When `true`, all form elements will be disabled on `@submit` event.
     * This will cause any focused input elements to lose their focus state.
     * @defaultValue `true`
     */
    loadingAuto?: boolean;
    class?: any;
    onSubmit?: ((event: FormSubmitEvent<FormData<S, T>>) => void | Promise<void>) | (() => void | Promise<void>);
}
export interface FormEmits<S extends FormSchema, T extends boolean = true> {
    submit: [payload: FormSubmitEvent<FormData<S, T>>];
    error: [payload: FormErrorEvent];
}
export interface FormSlots {
    default(props?: {
        errors: FormError[];
        loading: boolean;
    }): any;
}
declare const _default: <S extends FormSchema, T extends boolean = true>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{
        readonly onError?: ((payload: FormErrorEvent) => any) | undefined;
        readonly onSubmit?: ((payload: FormSubmitEvent<FormData<S, T>>) => any) | undefined;
    } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, "onSubmit" | "onError"> & FormProps<S, T> & Partial<{}>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<Form<S>>): void;
    attrs: any;
    slots: FormSlots;
    emit: ((evt: "error", payload: FormErrorEvent) => void) & ((evt: "submit", payload: FormSubmitEvent<FormData<S, T>>) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T as K]: T[K];
} & {};
