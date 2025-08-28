export interface IconProps {
    name: string;
    mode?: 'svg' | 'css';
    size?: string | number;
    customize?: (content: string, name?: string, prefix?: string, provider?: string) => string;
}
declare const _default: import("vue").DefineComponent<IconProps, void, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<IconProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
