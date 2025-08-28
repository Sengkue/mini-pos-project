import type { AppConfig } from '@nuxt/schema';
import type { UseFileDialogReturn } from '@vueuse/core';
import theme from '#build/ui/file-upload';
import type { ButtonProps } from '../types';
import type { ComponentConfig } from '../types/utils';
type FileUpload = ComponentConfig<typeof theme, AppConfig, 'fileUpload'>;
export interface FileUploadProps<M extends boolean = false> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    id?: string;
    name?: string;
    /**
     * The icon to display.
     * @defaultValue appConfig.ui.icons.upload
     * @IconifyIcon
     */
    icon?: string;
    label?: string;
    description?: string;
    /**
     * @defaultValue 'primary'
     */
    color?: FileUpload['variants']['color'];
    /**
     * The `button` variant is only available when `multiple` is `false`.
     * @defaultValue 'area'
     */
    variant?: FileUpload['variants']['variant'];
    /**
     * @defaultValue 'md'
     */
    size?: FileUpload['variants']['size'];
    /**
     * The layout of how files are displayed.
     * Only works when `variant` is `area`.
     * @defaultValue 'list'
     */
    layout?: FileUpload['variants']['layout'];
    /**
     * The position of the files.
     * Only works when `variant` is `area` and when `layout` is `list`.
     * @defaultValue 'outside'
     */
    position?: FileUpload['variants']['position'];
    /** Highlight the ring color like a focus state. */
    highlight?: boolean;
    /**
     * Specifies the allowed file types for the input. Provide a comma-separated list of MIME types or file extensions (e.g., "image/png,application/pdf,.jpg").
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept
     * @defaultValue '*'
     */
    accept?: string;
    multiple?: M & boolean;
    /**
     * Reset the file input when the dialog is opened.
     * @defaultValue false
     */
    reset?: boolean;
    /**
     * Create a zone that allows the user to drop files onto it.
     * @defaultValue true
     */
    dropzone?: boolean;
    /**
     * Make the dropzone interactive when the user is clicking on it.
     * @defaultValue true
     */
    interactive?: boolean;
    required?: boolean;
    disabled?: boolean;
    /**
     * The icon to display for the file.
     * @defaultValue appConfig.ui.icons.file
     * @IconifyIcon
     */
    fileIcon?: string;
    /**
     * Configure the delete button for the file.
     * When `layout` is `grid`, the default is `{ color: 'neutral', variant: 'solid', size: 'xs' }`{lang="ts-type"}
     * When `layout` is `list`, the default is `{ color: 'neutral', variant: 'link' }`{lang="ts-type"}
     */
    fileDelete?: boolean | Partial<ButtonProps>;
    /**
     * The icon displayed to delete a file.
     * @defaultValue appConfig.ui.icons.close
     * @IconifyIcon
     */
    fileDeleteIcon?: string;
    class?: any;
    ui?: FileUpload['slots'];
}
export interface FileUploadEmits<M extends boolean = false> {
    'update:modelValue': [payload: M extends true ? File[] : File | null];
    'change': [event: Event];
}
type FileUploadFiles<M> = (M extends true ? File[] : File) | null;
export interface FileUploadSlots<M extends boolean = false> {
    'default'(props: {
        open: UseFileDialogReturn['open'];
        removeFile: (index?: number) => void;
    }): any;
    'leading'(props?: {}): any;
    'label'(props?: {}): any;
    'description'(props?: {}): any;
    'actions'(props: {
        files?: FileUploadFiles<M>;
        open: UseFileDialogReturn['open'];
        removeFile: (index?: number) => void;
    }): any;
    'files'(props: {
        files?: FileUploadFiles<M>;
    }): any;
    'files-top'(props: {
        files?: FileUploadFiles<M>;
        open: UseFileDialogReturn['open'];
        removeFile: (index?: number) => void;
    }): any;
    'files-bottom'(props: {
        files?: FileUploadFiles<M>;
        open: UseFileDialogReturn['open'];
        removeFile: (index?: number) => void;
    }): any;
    'file'(props: {
        file: File;
        index: number;
    }): any;
    'file-leading'(props: {
        file: File;
        index: number;
    }): any;
    'file-name'(props: {
        file: File;
        index: number;
    }): any;
    'file-size'(props: {
        file: File;
        index: number;
    }): any;
    'file-trailing'(props: {
        file: File;
        index: number;
    }): any;
}
declare const _default: <M extends boolean = false>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{
        readonly onChange?: ((event: Event) => any) | undefined;
        readonly "onUpdate:modelValue"?: ((...args: unknown[]) => any) | undefined;
    } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, "onChange" | "onUpdate:modelValue"> & (FileUploadProps<M> & {
        modelValue?: (M extends true ? File[] : File) | null;
    }) & Partial<{}>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<{
        inputRef: import("vue").Ref<HTMLInputElement | undefined, HTMLInputElement | undefined>;
        dropzoneRef: import("vue").Ref<HTMLDivElement | undefined, HTMLDivElement | undefined>;
    }>): void;
    attrs: any;
    slots: FileUploadSlots<M>;
    emit: (((evt: "change", event: Event) => void) & ((evt: "update:modelValue", payload: M extends true ? File[] : File | null) => void)) & ((evt: "update:modelValue", value: (M extends true ? File[] : File) | null | undefined) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T as K]: T[K];
} & {};
