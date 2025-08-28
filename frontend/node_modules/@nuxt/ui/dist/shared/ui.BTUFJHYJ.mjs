import { pick } from '../../dist/runtime/utils/index.js';
import 'node:url';
import { kebabCase } from 'scule';
import { addTypeTemplate, addTemplate } from '@nuxt/kit';
import { defuFn, defu } from 'defu';
import colors from 'tailwindcss/colors';
import { genExport } from 'knitwork';

const icons = {
  arrowLeft: "i-lucide-arrow-left",
  arrowRight: "i-lucide-arrow-right",
  check: "i-lucide-check",
  chevronDoubleLeft: "i-lucide-chevrons-left",
  chevronDoubleRight: "i-lucide-chevrons-right",
  chevronDown: "i-lucide-chevron-down",
  chevronLeft: "i-lucide-chevron-left",
  chevronRight: "i-lucide-chevron-right",
  chevronUp: "i-lucide-chevron-up",
  close: "i-lucide-x",
  ellipsis: "i-lucide-ellipsis",
  external: "i-lucide-arrow-up-right",
  file: "i-lucide-file",
  folder: "i-lucide-folder",
  folderOpen: "i-lucide-folder-open",
  loading: "i-lucide-loader-circle",
  minus: "i-lucide-minus",
  plus: "i-lucide-plus",
  search: "i-lucide-search",
  upload: "i-lucide-upload"
};

const getDefaultUiConfig = (colors) => ({
  colors: pick({
    primary: "green",
    secondary: "blue",
    success: "green",
    info: "blue",
    warning: "yellow",
    error: "red",
    neutral: "slate"
  }, [...colors || [], "neutral"]),
  icons
});
const defaultOptions = {
  prefix: "U",
  fonts: true,
  colorMode: true,
  theme: {
    colors: void 0,
    transitions: true
  }
};
const resolveColors = (colors) => {
  return colors?.length ? [.../* @__PURE__ */ new Set(["primary", ...colors])] : ["primary", "secondary", "success", "info", "warning", "error"];
};

const accordion = {
  slots: {
    root: "w-full",
    item: "border-b border-default last:border-b-0",
    header: "flex",
    trigger: "group flex-1 flex items-center gap-1.5 font-medium text-sm py-3.5 focus-visible:outline-primary min-w-0",
    content: "data-[state=open]:animate-[accordion-down_200ms_ease-out] data-[state=closed]:animate-[accordion-up_200ms_ease-out] overflow-hidden focus:outline-none",
    body: "text-sm pb-3.5",
    leadingIcon: "shrink-0 size-5",
    trailingIcon: "shrink-0 size-5 ms-auto group-data-[state=open]:rotate-180 transition-transform duration-200",
    label: "text-start break-words"
  },
  variants: {
    disabled: {
      true: {
        trigger: "cursor-not-allowed opacity-75"
      }
    }
  }
};

const alert = (options) => ({
  slots: {
    root: "relative overflow-hidden w-full rounded-lg p-4 flex gap-2.5",
    wrapper: "min-w-0 flex-1 flex flex-col",
    title: "text-sm font-medium",
    description: "text-sm opacity-90",
    icon: "shrink-0 size-5",
    avatar: "shrink-0",
    avatarSize: "2xl",
    actions: "flex flex-wrap gap-1.5 shrink-0",
    close: "p-0"
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, ""])),
      neutral: ""
    },
    variant: {
      solid: "",
      outline: "",
      soft: "",
      subtle: ""
    },
    orientation: {
      horizontal: {
        root: "items-center",
        actions: "items-center"
      },
      vertical: {
        root: "items-start",
        actions: "items-start mt-2.5"
      }
    },
    title: {
      true: {
        description: "mt-1"
      }
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color) => ({
    color,
    variant: "solid",
    class: {
      root: `bg-${color} text-inverted`
    }
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "outline",
    class: {
      root: `text-${color} ring ring-inset ring-${color}/25`
    }
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "soft",
    class: {
      root: `bg-${color}/10 text-${color}`
    }
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "subtle",
    class: {
      root: `bg-${color}/10 text-${color} ring ring-inset ring-${color}/25`
    }
  })), {
    color: "neutral",
    variant: "solid",
    class: {
      root: "text-inverted bg-inverted"
    }
  }, {
    color: "neutral",
    variant: "outline",
    class: {
      root: "text-highlighted bg-default ring ring-inset ring-default"
    }
  }, {
    color: "neutral",
    variant: "soft",
    class: {
      root: "text-highlighted bg-elevated/50"
    }
  }, {
    color: "neutral",
    variant: "subtle",
    class: {
      root: "text-highlighted bg-elevated/50 ring ring-inset ring-accented"
    }
  }],
  defaultVariants: {
    color: "primary",
    variant: "solid"
  }
});

const avatar = {
  slots: {
    root: "inline-flex items-center justify-center shrink-0 select-none rounded-full align-middle bg-elevated",
    image: "h-full w-full rounded-[inherit] object-cover",
    fallback: "font-medium leading-none text-muted truncate",
    icon: "text-muted shrink-0"
  },
  variants: {
    size: {
      "3xs": {
        root: "size-4 text-[8px]"
      },
      "2xs": {
        root: "size-5 text-[10px]"
      },
      "xs": {
        root: "size-6 text-xs"
      },
      "sm": {
        root: "size-7 text-sm"
      },
      "md": {
        root: "size-8 text-base"
      },
      "lg": {
        root: "size-9 text-lg"
      },
      "xl": {
        root: "size-10 text-xl"
      },
      "2xl": {
        root: "size-11 text-[22px]"
      },
      "3xl": {
        root: "size-12 text-2xl"
      }
    }
  },
  defaultVariants: {
    size: "md"
  }
};

const avatarGroup = {
  slots: {
    root: "inline-flex flex-row-reverse justify-end",
    base: "relative rounded-full ring-bg first:me-0"
  },
  variants: {
    size: {
      "3xs": {
        base: "ring -me-0.5"
      },
      "2xs": {
        base: "ring -me-0.5"
      },
      "xs": {
        base: "ring -me-0.5"
      },
      "sm": {
        base: "ring-2 -me-1.5"
      },
      "md": {
        base: "ring-2 -me-1.5"
      },
      "lg": {
        base: "ring-2 -me-1.5"
      },
      "xl": {
        base: "ring-3 -me-2"
      },
      "2xl": {
        base: "ring-3 -me-2"
      },
      "3xl": {
        base: "ring-3 -me-2"
      }
    }
  },
  defaultVariants: {
    size: "md"
  }
};

const buttonGroupVariant = {
  buttonGroup: {
    horizontal: "not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none focus-visible:z-[1]",
    vertical: "not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none focus-visible:z-[1]"
  }
};
const buttonGroupVariantWithRoot = {
  buttonGroup: {
    horizontal: {
      root: "group has-focus-visible:z-[1]",
      base: "group-not-only:group-first:rounded-e-none group-not-only:group-last:rounded-s-none group-not-last:group-not-first:rounded-none"
    },
    vertical: {
      root: "group has-focus-visible:z-[1]",
      base: "group-not-only:group-first:rounded-b-none group-not-only:group-last:rounded-t-none group-not-last:group-not-first:rounded-none"
    }
  }
};
const buttonGroup = {
  base: "relative",
  variants: {
    size: {
      xs: "",
      sm: "",
      md: "",
      lg: "",
      xl: ""
    },
    orientation: {
      horizontal: "inline-flex -space-x-px",
      vertical: "flex flex-col -space-y-px"
    }
  }
};

const badge = (options) => ({
  slots: {
    base: "font-medium inline-flex items-center",
    label: "truncate",
    leadingIcon: "shrink-0",
    leadingAvatar: "shrink-0",
    leadingAvatarSize: "",
    trailingIcon: "shrink-0"
  },
  variants: {
    ...buttonGroupVariant,
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, ""])),
      neutral: ""
    },
    variant: {
      solid: "",
      outline: "",
      soft: "",
      subtle: ""
    },
    size: {
      xs: {
        base: "text-[8px]/3 px-1 py-0.5 gap-1 rounded-sm",
        leadingIcon: "size-3",
        leadingAvatarSize: "3xs",
        trailingIcon: "size-3"
      },
      sm: {
        base: "text-[10px]/3 px-1.5 py-1 gap-1 rounded-sm",
        leadingIcon: "size-3",
        leadingAvatarSize: "3xs",
        trailingIcon: "size-3"
      },
      md: {
        base: "text-xs px-2 py-1 gap-1 rounded-md",
        leadingIcon: "size-4",
        leadingAvatarSize: "3xs",
        trailingIcon: "size-4"
      },
      lg: {
        base: "text-sm px-2 py-1 gap-1.5 rounded-md",
        leadingIcon: "size-5",
        leadingAvatarSize: "2xs",
        trailingIcon: "size-5"
      },
      xl: {
        base: "text-base px-2.5 py-1 gap-1.5 rounded-md",
        leadingIcon: "size-6",
        leadingAvatarSize: "2xs",
        trailingIcon: "size-6"
      }
    },
    square: {
      true: ""
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color) => ({
    color,
    variant: "solid",
    class: `bg-${color} text-inverted`
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "outline",
    class: `text-${color} ring ring-inset ring-${color}/50`
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "soft",
    class: `bg-${color}/10 text-${color}`
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "subtle",
    class: `bg-${color}/10 text-${color} ring ring-inset ring-${color}/25`
  })), {
    color: "neutral",
    variant: "solid",
    class: "text-inverted bg-inverted"
  }, {
    color: "neutral",
    variant: "outline",
    class: "ring ring-inset ring-accented text-default bg-default"
  }, {
    color: "neutral",
    variant: "soft",
    class: "text-default bg-elevated"
  }, {
    color: "neutral",
    variant: "subtle",
    class: "ring ring-inset ring-accented text-default bg-elevated"
  }, {
    size: "xs",
    square: true,
    class: "p-0.5"
  }, {
    size: "sm",
    square: true,
    class: "p-1"
  }, {
    size: "md",
    square: true,
    class: "p-1"
  }, {
    size: "lg",
    square: true,
    class: "p-1"
  }, {
    size: "xl",
    square: true,
    class: "p-1"
  }],
  defaultVariants: {
    color: "primary",
    variant: "solid",
    size: "md"
  }
});

const breadcrumb = (options) => ({
  slots: {
    root: "relative min-w-0",
    list: "flex items-center gap-1.5",
    item: "flex min-w-0",
    link: "group relative flex items-center gap-1.5 text-sm min-w-0 focus-visible:outline-primary",
    linkLeadingIcon: "shrink-0 size-5",
    linkLeadingAvatar: "shrink-0",
    linkLeadingAvatarSize: "2xs",
    linkLabel: "truncate",
    separator: "flex",
    separatorIcon: "shrink-0 size-5 text-muted"
  },
  variants: {
    active: {
      true: {
        link: "text-primary font-semibold"
      },
      false: {
        link: "text-muted font-medium"
      }
    },
    disabled: {
      true: {
        link: "cursor-not-allowed opacity-75"
      }
    },
    to: {
      true: ""
    }
  },
  compoundVariants: [{
    disabled: false,
    active: false,
    to: true,
    class: {
      link: ["hover:text-default", options.theme.transitions && "transition-colors"]
    }
  }]
});

const button = (options) => ({
  slots: {
    base: ["rounded-md font-medium inline-flex items-center disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75", options.theme.transitions && "transition-colors"],
    label: "truncate",
    leadingIcon: "shrink-0",
    leadingAvatar: "shrink-0",
    leadingAvatarSize: "",
    trailingIcon: "shrink-0"
  },
  variants: {
    ...buttonGroupVariant,
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, ""])),
      neutral: ""
    },
    variant: {
      solid: "",
      outline: "",
      soft: "",
      subtle: "",
      ghost: "",
      link: ""
    },
    size: {
      xs: {
        base: "px-2 py-1 text-xs gap-1",
        leadingIcon: "size-4",
        leadingAvatarSize: "3xs",
        trailingIcon: "size-4"
      },
      sm: {
        base: "px-2.5 py-1.5 text-xs gap-1.5",
        leadingIcon: "size-4",
        leadingAvatarSize: "3xs",
        trailingIcon: "size-4"
      },
      md: {
        base: "px-2.5 py-1.5 text-sm gap-1.5",
        leadingIcon: "size-5",
        leadingAvatarSize: "2xs",
        trailingIcon: "size-5"
      },
      lg: {
        base: "px-3 py-2 text-sm gap-2",
        leadingIcon: "size-5",
        leadingAvatarSize: "2xs",
        trailingIcon: "size-5"
      },
      xl: {
        base: "px-3 py-2 text-base gap-2",
        leadingIcon: "size-6",
        leadingAvatarSize: "xs",
        trailingIcon: "size-6"
      }
    },
    block: {
      true: {
        base: "w-full justify-center",
        trailingIcon: "ms-auto"
      }
    },
    square: {
      true: ""
    },
    leading: {
      true: ""
    },
    trailing: {
      true: ""
    },
    loading: {
      true: ""
    },
    active: {
      true: {
        base: ""
      },
      false: {
        base: ""
      }
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color) => ({
    color,
    variant: "solid",
    class: `text-inverted bg-${color} hover:bg-${color}/75 active:bg-${color}/75 disabled:bg-${color} aria-disabled:bg-${color} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-${color}`
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "outline",
    class: `ring ring-inset ring-${color}/50 text-${color} hover:bg-${color}/10 active:bg-${color}/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-${color}`
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "soft",
    class: `text-${color} bg-${color}/10 hover:bg-${color}/15 active:bg-${color}/15 focus:outline-none focus-visible:bg-${color}/15 disabled:bg-${color}/10 aria-disabled:bg-${color}/10`
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "subtle",
    class: `text-${color} ring ring-inset ring-${color}/25 bg-${color}/10 hover:bg-${color}/15 active:bg-${color}/15 disabled:bg-${color}/10 aria-disabled:bg-${color}/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-${color}`
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "ghost",
    class: `text-${color} hover:bg-${color}/10 active:bg-${color}/10 focus:outline-none focus-visible:bg-${color}/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent`
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "link",
    class: `text-${color} hover:text-${color}/75 active:text-${color}/75 disabled:text-${color} aria-disabled:text-${color} focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-${color}`
  })), {
    color: "neutral",
    variant: "solid",
    class: "text-inverted bg-inverted hover:bg-inverted/90 active:bg-inverted/90 disabled:bg-inverted aria-disabled:bg-inverted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverted"
  }, {
    color: "neutral",
    variant: "outline",
    class: "ring ring-inset ring-accented text-default bg-default hover:bg-elevated active:bg-elevated disabled:bg-default aria-disabled:bg-default focus:outline-none focus-visible:ring-2 focus-visible:ring-inverted"
  }, {
    color: "neutral",
    variant: "soft",
    class: "text-default bg-elevated hover:bg-accented/75 active:bg-accented/75 focus:outline-none focus-visible:bg-accented/75 disabled:bg-elevated aria-disabled:bg-elevated"
  }, {
    color: "neutral",
    variant: "subtle",
    class: "ring ring-inset ring-accented text-default bg-elevated hover:bg-accented/75 active:bg-accented/75 disabled:bg-elevated aria-disabled:bg-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-inverted"
  }, {
    color: "neutral",
    variant: "ghost",
    class: "text-default hover:bg-elevated active:bg-elevated focus:outline-none focus-visible:bg-elevated hover:disabled:bg-transparent dark:hover:disabled:bg-transparent hover:aria-disabled:bg-transparent dark:hover:aria-disabled:bg-transparent"
  }, {
    color: "neutral",
    variant: "link",
    class: "text-muted hover:text-default active:text-default disabled:text-muted aria-disabled:text-muted focus:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-inverted"
  }, {
    size: "xs",
    square: true,
    class: "p-1"
  }, {
    size: "sm",
    square: true,
    class: "p-1.5"
  }, {
    size: "md",
    square: true,
    class: "p-1.5"
  }, {
    size: "lg",
    square: true,
    class: "p-2"
  }, {
    size: "xl",
    square: true,
    class: "p-2"
  }, {
    loading: true,
    leading: true,
    class: {
      leadingIcon: "animate-spin"
    }
  }, {
    loading: true,
    leading: false,
    trailing: true,
    class: {
      trailingIcon: "animate-spin"
    }
  }],
  defaultVariants: {
    color: "primary",
    variant: "solid",
    size: "md"
  }
});

const calendar = (options) => ({
  slots: {
    root: "",
    header: "flex items-center justify-between",
    body: "flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0",
    heading: "text-center font-medium truncate mx-auto",
    grid: "w-full border-collapse select-none space-y-1 focus:outline-none",
    gridRow: "grid grid-cols-7 place-items-center",
    gridWeekDaysRow: "mb-1 grid w-full grid-cols-7",
    gridBody: "grid",
    headCell: "rounded-md",
    cell: "relative text-center",
    cellTrigger: ["m-0.5 relative flex items-center justify-center rounded-full whitespace-nowrap focus-visible:ring-2 focus:outline-none data-disabled:text-muted data-unavailable:line-through data-unavailable:text-muted data-unavailable:pointer-events-none data-[selected]:text-inverted data-today:font-semibold data-[outside-view]:text-muted", options.theme.transitions && "transition"]
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, {
        headCell: `text-${color}`,
        cellTrigger: `focus-visible:ring-${color} data-[selected]:bg-${color} data-today:not-data-[selected]:text-${color} data-[highlighted]:bg-${color}/20 hover:not-data-[selected]:bg-${color}/20`
      }])),
      neutral: {
        headCell: "text-highlighted",
        cellTrigger: "focus-visible:ring-inverted data-[selected]:bg-inverted data-today:not-data-[selected]:text-highlighted data-[highlighted]:bg-inverted/20 hover:not-data-[selected]:bg-inverted/10"
      }
    },
    size: {
      xs: {
        heading: "text-xs",
        cell: "text-xs",
        headCell: "text-[10px]",
        cellTrigger: "size-7",
        body: "space-y-2 pt-2"
      },
      sm: {
        heading: "text-xs",
        headCell: "text-xs",
        cell: "text-xs",
        cellTrigger: "size-7"
      },
      md: {
        heading: "text-sm",
        headCell: "text-xs",
        cell: "text-sm",
        cellTrigger: "size-8"
      },
      lg: {
        heading: "text-md",
        headCell: "text-md",
        cellTrigger: "size-9 text-md"
      },
      xl: {
        heading: "text-lg",
        headCell: "text-lg",
        cellTrigger: "size-10 text-lg"
      }
    }
  },
  defaultVariants: {
    size: "md",
    color: "primary"
  }
});

const card = {
  slots: {
    root: "rounded-lg overflow-hidden",
    header: "p-4 sm:px-6",
    body: "p-4 sm:p-6",
    footer: "p-4 sm:px-6"
  },
  variants: {
    variant: {
      solid: {
        root: "bg-inverted text-inverted"
      },
      outline: {
        root: "bg-default ring ring-default divide-y divide-default"
      },
      soft: {
        root: "bg-elevated/50 divide-y divide-default"
      },
      subtle: {
        root: "bg-elevated/50 ring ring-default divide-y divide-default"
      }
    }
  },
  defaultVariants: {
    variant: "outline"
  }
};

const carousel = (options) => ({
  slots: {
    root: "relative focus:outline-none",
    viewport: "overflow-hidden",
    container: "flex items-start",
    item: "min-w-0 shrink-0 basis-full",
    controls: "",
    arrows: "",
    prev: "absolute rounded-full",
    next: "absolute rounded-full",
    dots: "absolute inset-x-0 -bottom-7 flex flex-wrap items-center justify-center gap-3",
    dot: ["cursor-pointer size-3 bg-accented rounded-full", options.theme.transitions && "transition"]
  },
  variants: {
    orientation: {
      vertical: {
        container: "flex-col -mt-4",
        item: "pt-4",
        prev: "top-4 sm:-top-12 left-1/2 -translate-x-1/2 rotate-90 rtl:-rotate-90",
        next: "bottom-4 sm:-bottom-12 left-1/2 -translate-x-1/2 rotate-90 rtl:-rotate-90"
      },
      horizontal: {
        container: "flex-row -ms-4",
        item: "ps-4",
        prev: "start-4 sm:-start-12 top-1/2 -translate-y-1/2",
        next: "end-4 sm:-end-12 top-1/2 -translate-y-1/2"
      }
    },
    active: {
      true: {
        dot: "data-[state=active]:bg-inverted"
      }
    }
  }
});

const checkbox = (options) => ({
  slots: {
    root: "relative flex items-start",
    container: "flex items-center",
    base: "rounded-sm ring ring-inset ring-accented overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2",
    indicator: "flex items-center justify-center size-full text-inverted",
    icon: "shrink-0 size-full",
    wrapper: "w-full",
    label: "block font-medium text-default",
    description: "text-muted"
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, {
        base: `focus-visible:outline-${color}`,
        indicator: `bg-${color}`
      }])),
      neutral: {
        base: "focus-visible:outline-inverted",
        indicator: "bg-inverted"
      }
    },
    variant: {
      list: {
        root: ""
      },
      card: {
        root: "border border-muted rounded-lg"
      }
    },
    indicator: {
      start: {
        root: "flex-row",
        wrapper: "ms-2"
      },
      end: {
        root: "flex-row-reverse",
        wrapper: "me-2"
      },
      hidden: {
        base: "sr-only",
        wrapper: "text-center"
      }
    },
    size: {
      xs: {
        base: "size-3",
        container: "h-4",
        wrapper: "text-xs"
      },
      sm: {
        base: "size-3.5",
        container: "h-4",
        wrapper: "text-xs"
      },
      md: {
        base: "size-4",
        container: "h-5",
        wrapper: "text-sm"
      },
      lg: {
        base: "size-4.5",
        container: "h-5",
        wrapper: "text-sm"
      },
      xl: {
        base: "size-5",
        container: "h-6",
        wrapper: "text-base"
      }
    },
    required: {
      true: {
        label: "after:content-['*'] after:ms-0.5 after:text-error"
      }
    },
    disabled: {
      true: {
        base: "cursor-not-allowed opacity-75",
        label: "cursor-not-allowed opacity-75",
        description: "cursor-not-allowed opacity-75"
      }
    },
    checked: {
      true: ""
    }
  },
  compoundVariants: [
    { size: "xs", variant: "card", class: { root: "p-2.5" } },
    { size: "sm", variant: "card", class: { root: "p-3" } },
    { size: "md", variant: "card", class: { root: "p-3.5" } },
    { size: "lg", variant: "card", class: { root: "p-4" } },
    { size: "xl", variant: "card", class: { root: "p-4.5" } },
    ...(options.theme.colors || []).map((color) => ({
      color,
      variant: "card",
      class: {
        root: `has-data-[state=checked]:border-${color}`
      }
    })),
    {
      color: "neutral",
      variant: "card",
      class: {
        root: "has-data-[state=checked]:border-inverted"
      }
    },
    {
      variant: "card",
      disabled: true,
      class: {
        root: "cursor-not-allowed opacity-75"
      }
    }
  ],
  defaultVariants: {
    size: "md",
    color: "primary",
    variant: "list",
    indicator: "start"
  }
});

const checkboxGroup = (options) => ({
  slots: {
    root: "relative",
    fieldset: "flex gap-x-2",
    legend: "mb-1 block font-medium text-default",
    item: ""
  },
  variants: {
    orientation: {
      horizontal: {
        fieldset: "flex-row"
      },
      vertical: {
        fieldset: "flex-col"
      }
    },
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, {}])),
      neutral: {}
    },
    variant: {
      list: {},
      card: {},
      table: {
        item: "border border-muted"
      }
    },
    size: {
      xs: {
        fieldset: "gap-y-0.5",
        legend: "text-xs"
      },
      sm: {
        fieldset: "gap-y-0.5",
        legend: "text-xs"
      },
      md: {
        fieldset: "gap-y-1",
        legend: "text-sm"
      },
      lg: {
        fieldset: "gap-y-1",
        legend: "text-sm"
      },
      xl: {
        fieldset: "gap-y-1.5",
        legend: "text-base"
      }
    },
    required: {
      true: {
        legend: "after:content-['*'] after:ms-0.5 after:text-error"
      }
    }
  },
  compoundVariants: [
    { size: "xs", variant: "table", class: { item: "p-2.5" } },
    { size: "sm", variant: "table", class: { item: "p-3" } },
    { size: "md", variant: "table", class: { item: "p-3.5" } },
    { size: "lg", variant: "table", class: { item: "p-4" } },
    { size: "xl", variant: "table", class: { item: "p-4.5" } },
    {
      orientation: "horizontal",
      variant: "table",
      class: {
        item: "first-of-type:rounded-s-lg last-of-type:rounded-e-lg",
        fieldset: "gap-0 -space-x-px"
      }
    },
    {
      orientation: "vertical",
      variant: "table",
      class: {
        item: "first-of-type:rounded-t-lg last-of-type:rounded-b-lg",
        fieldset: "gap-0 -space-y-px"
      }
    },
    ...(options.theme.colors || []).map((color) => ({
      color,
      variant: "table",
      class: {
        item: `has-data-[state=checked]:bg-${color}/10 has-data-[state=checked]:border-${color}/50 has-data-[state=checked]:z-[1]`
      }
    })),
    {
      color: "neutral",
      variant: "table",
      class: {
        item: "has-data-[state=checked]:bg-elevated has-data-[state=checked]:border-inverted/50 has-data-[state=checked]:z-[1]"
      }
    },
    {
      variant: "table",
      disabled: true,
      class: {
        item: "cursor-not-allowed opacity-75"
      }
    }
  ],
  defaultVariants: {
    size: "md",
    variant: "list",
    color: "primary"
  }
});

const chip = (options) => ({
  slots: {
    root: "relative inline-flex items-center justify-center shrink-0",
    base: "rounded-full ring ring-bg flex items-center justify-center text-inverted font-medium whitespace-nowrap"
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, `bg-${color}`])),
      neutral: "bg-inverted"
    },
    size: {
      "3xs": "h-[4px] min-w-[4px] text-[4px]",
      "2xs": "h-[5px] min-w-[5px] text-[5px]",
      "xs": "h-[6px] min-w-[6px] text-[6px]",
      "sm": "h-[7px] min-w-[7px] text-[7px]",
      "md": "h-[8px] min-w-[8px] text-[8px]",
      "lg": "h-[9px] min-w-[9px] text-[9px]",
      "xl": "h-[10px] min-w-[10px] text-[10px]",
      "2xl": "h-[11px] min-w-[11px] text-[11px]",
      "3xl": "h-[12px] min-w-[12px] text-[12px]"
    },
    position: {
      "top-right": "top-0 right-0",
      "bottom-right": "bottom-0 right-0",
      "top-left": "top-0 left-0",
      "bottom-left": "bottom-0 left-0"
    },
    inset: {
      false: ""
    },
    standalone: {
      false: "absolute"
    }
  },
  compoundVariants: [{
    position: "top-right",
    inset: false,
    class: "-translate-y-1/2 translate-x-1/2 transform"
  }, {
    position: "bottom-right",
    inset: false,
    class: "translate-y-1/2 translate-x-1/2 transform"
  }, {
    position: "top-left",
    inset: false,
    class: "-translate-y-1/2 -translate-x-1/2 transform"
  }, {
    position: "bottom-left",
    inset: false,
    class: "translate-y-1/2 -translate-x-1/2 transform"
  }],
  defaultVariants: {
    size: "md",
    color: "primary",
    position: "top-right"
  }
});

const collapsible = {
  slots: {
    root: "",
    content: "data-[state=open]:animate-[collapsible-down_200ms_ease-out] data-[state=closed]:animate-[collapsible-up_200ms_ease-out] overflow-hidden"
  }
};

const colorPicker = {
  slots: {
    root: "data-[disabled]:opacity-75",
    picker: "flex gap-4",
    selector: "rounded-md touch-none",
    selectorBackground: "w-full h-full relative rounded-md",
    selectorThumb: "-translate-y-1/2 -translate-x-1/2 absolute size-4 ring-2 ring-(--color-white) rounded-full cursor-pointer data-[disabled]:cursor-not-allowed",
    track: "w-[8px] relative rounded-md touch-none",
    trackThumb: "absolute transform -translate-y-1/2 -translate-x-[4px] rtl:translate-x-[4px] size-4 rounded-full ring-2 ring-(--color-white) cursor-pointer data-[disabled]:cursor-not-allowed"
  },
  variants: {
    size: {
      xs: {
        selector: "w-38 h-38",
        track: "h-38"
      },
      sm: {
        selector: "w-40 h-40",
        track: "h-40"
      },
      md: {
        selector: "w-42 h-42",
        track: "h-42"
      },
      lg: {
        selector: "w-44 h-44",
        track: "h-44"
      },
      xl: {
        selector: "w-46 h-46",
        track: "h-46"
      }
    }
  },
  compoundVariants: [],
  defaultVariants: {
    size: "md"
  }
};

const commandPalette = (options) => ({
  slots: {
    root: "flex flex-col min-h-0 min-w-0 divide-y divide-default",
    input: "[&>input]:h-12",
    close: "",
    back: "p-0",
    content: "relative overflow-hidden flex flex-col",
    footer: "p-1",
    viewport: "relative divide-y divide-default scroll-py-1 overflow-y-auto flex-1 focus:outline-none",
    group: "p-1 isolate",
    empty: "py-6 text-center text-sm text-muted",
    label: "p-1.5 text-xs font-semibold text-highlighted",
    item: "group relative w-full flex items-center gap-1.5 p-1.5 text-sm select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75",
    itemLeadingIcon: "shrink-0 size-5",
    itemLeadingAvatar: "shrink-0",
    itemLeadingAvatarSize: "2xs",
    itemLeadingChip: "shrink-0 size-5",
    itemLeadingChipSize: "md",
    itemTrailing: "ms-auto inline-flex gap-1.5 items-center",
    itemTrailingIcon: "shrink-0 size-5",
    itemTrailingHighlightedIcon: "shrink-0 size-5 text-dimmed hidden group-data-highlighted:inline-flex",
    itemTrailingKbds: "hidden lg:inline-flex items-center shrink-0 gap-0.5",
    itemTrailingKbdsSize: "md",
    itemLabel: "truncate space-x-1 text-dimmed",
    itemLabelBase: "text-highlighted [&>mark]:text-inverted [&>mark]:bg-primary",
    itemLabelPrefix: "text-default",
    itemLabelSuffix: "text-dimmed [&>mark]:text-inverted [&>mark]:bg-primary"
  },
  variants: {
    active: {
      true: {
        item: "text-highlighted before:bg-elevated",
        itemLeadingIcon: "text-default"
      },
      false: {
        item: ["text-default data-highlighted:not-data-disabled:text-highlighted data-highlighted:not-data-disabled:before:bg-elevated/50", options.theme.transitions && "transition-colors before:transition-colors"],
        itemLeadingIcon: ["text-dimmed group-data-highlighted:not-group-data-disabled:text-default", options.theme.transitions && "transition-colors"]
      }
    },
    loading: {
      true: {
        itemLeadingIcon: "animate-spin"
      }
    }
  }
});

const container = {
  base: "w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8"
};

const contextMenu = (options) => ({
  slots: {
    content: "min-w-32 bg-default shadow-lg rounded-md ring ring-default overflow-hidden data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] origin-(--reka-context-menu-content-transform-origin) flex flex-col",
    viewport: "relative divide-y divide-default scroll-py-1 overflow-y-auto flex-1",
    group: "p-1 isolate",
    label: "w-full flex items-center font-semibold text-highlighted",
    separator: "-mx-1 my-1 h-px bg-border",
    item: "group relative w-full flex items-center select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75",
    itemLeadingIcon: "shrink-0",
    itemLeadingAvatar: "shrink-0",
    itemLeadingAvatarSize: "",
    itemTrailing: "ms-auto inline-flex gap-1.5 items-center",
    itemTrailingIcon: "shrink-0",
    itemTrailingKbds: "hidden lg:inline-flex items-center shrink-0",
    itemTrailingKbdsSize: "",
    itemLabel: "truncate",
    itemLabelExternalIcon: "inline-block size-3 align-top text-dimmed"
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, ""])),
      neutral: ""
    },
    active: {
      true: {
        item: "text-highlighted before:bg-elevated",
        itemLeadingIcon: "text-default"
      },
      false: {
        item: ["text-default data-highlighted:text-highlighted data-[state=open]:text-highlighted data-highlighted:before:bg-elevated/50 data-[state=open]:before:bg-elevated/50", options.theme.transitions && "transition-colors before:transition-colors"],
        itemLeadingIcon: ["text-dimmed group-data-highlighted:text-default group-data-[state=open]:text-default", options.theme.transitions && "transition-colors"]
      }
    },
    loading: {
      true: {
        itemLeadingIcon: "animate-spin"
      }
    },
    size: {
      xs: {
        label: "p-1 text-xs gap-1",
        item: "p-1 text-xs gap-1",
        itemLeadingIcon: "size-4",
        itemLeadingAvatarSize: "3xs",
        itemTrailingIcon: "size-4",
        itemTrailingKbds: "gap-0.5",
        itemTrailingKbdsSize: "sm"
      },
      sm: {
        label: "p-1.5 text-xs gap-1.5",
        item: "p-1.5 text-xs gap-1.5",
        itemLeadingIcon: "size-4",
        itemLeadingAvatarSize: "3xs",
        itemTrailingIcon: "size-4",
        itemTrailingKbds: "gap-0.5",
        itemTrailingKbdsSize: "sm"
      },
      md: {
        label: "p-1.5 text-sm gap-1.5",
        item: "p-1.5 text-sm gap-1.5",
        itemLeadingIcon: "size-5",
        itemLeadingAvatarSize: "2xs",
        itemTrailingIcon: "size-5",
        itemTrailingKbds: "gap-0.5",
        itemTrailingKbdsSize: "md"
      },
      lg: {
        label: "p-2 text-sm gap-2",
        item: "p-2 text-sm gap-2",
        itemLeadingIcon: "size-5",
        itemLeadingAvatarSize: "2xs",
        itemTrailingIcon: "size-5",
        itemTrailingKbds: "gap-1",
        itemTrailingKbdsSize: "md"
      },
      xl: {
        label: "p-2 text-base gap-2",
        item: "p-2 text-base gap-2",
        itemLeadingIcon: "size-6",
        itemLeadingAvatarSize: "xs",
        itemTrailingIcon: "size-6",
        itemTrailingKbds: "gap-1",
        itemTrailingKbdsSize: "lg"
      }
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color) => ({
    color,
    active: false,
    class: {
      item: `text-${color} data-highlighted:text-${color} data-highlighted:before:bg-${color}/10 data-[state=open]:before:bg-${color}/10`,
      itemLeadingIcon: `text-${color}/75 group-data-highlighted:text-${color} group-data-[state=open]:text-${color}`
    }
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    active: true,
    class: {
      item: `text-${color} before:bg-${color}/10`,
      itemLeadingIcon: `text-${color}`
    }
  }))],
  defaultVariants: {
    size: "md"
  }
});

const drawer = (options) => ({
  slots: {
    overlay: "fixed inset-0 bg-elevated/75",
    content: "fixed bg-default ring ring-default flex focus:outline-none",
    handle: ["shrink-0 !bg-accented", options.theme.transitions && "transition-opacity"],
    container: "w-full flex flex-col gap-4 p-4 overflow-y-auto",
    header: "",
    title: "text-highlighted font-semibold",
    description: "mt-1 text-muted text-sm",
    body: "flex-1",
    footer: "flex flex-col gap-1.5"
  },
  variants: {
    direction: {
      top: {
        content: "mb-24 flex-col-reverse",
        handle: "mb-4"
      },
      right: {
        content: "flex-row",
        handle: "!ml-4"
      },
      bottom: {
        content: "mt-24 flex-col",
        handle: "mt-4"
      },
      left: {
        content: "flex-row-reverse",
        handle: "!mr-4"
      }
    },
    inset: {
      true: {
        content: "rounded-lg after:hidden overflow-hidden [--initial-transform:calc(100%+1.5rem)]"
      }
    }
  },
  compoundVariants: [{
    direction: ["top", "bottom"],
    class: {
      content: "h-auto max-h-[96%]",
      handle: "!w-12 !h-1.5 mx-auto"
    }
  }, {
    direction: ["right", "left"],
    class: {
      content: "w-auto max-w-[calc(100%-2rem)]",
      handle: "!h-12 !w-1.5 mt-auto mb-auto"
    }
  }, {
    direction: "top",
    inset: true,
    class: {
      content: "inset-x-4 top-4"
    }
  }, {
    direction: "top",
    inset: false,
    class: {
      content: "inset-x-0 top-0 rounded-b-lg"
    }
  }, {
    direction: "bottom",
    inset: true,
    class: {
      content: "inset-x-4 bottom-4"
    }
  }, {
    direction: "bottom",
    inset: false,
    class: {
      content: "inset-x-0 bottom-0 rounded-t-lg"
    }
  }, {
    direction: "left",
    inset: true,
    class: {
      content: "inset-y-4 left-4"
    }
  }, {
    direction: "left",
    inset: false,
    class: {
      content: "inset-y-0 left-0 rounded-r-lg"
    }
  }, {
    direction: "right",
    inset: true,
    class: {
      content: "inset-y-4 right-4"
    }
  }, {
    direction: "right",
    inset: false,
    class: {
      content: "inset-y-0 right-0 rounded-l-lg"
    }
  }]
});

const dropdownMenu = (options) => ({
  slots: {
    content: "min-w-32 bg-default shadow-lg rounded-md ring ring-default overflow-hidden data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] origin-(--reka-dropdown-menu-content-transform-origin) flex flex-col",
    viewport: "relative divide-y divide-default scroll-py-1 overflow-y-auto flex-1",
    arrow: "fill-default",
    group: "p-1 isolate",
    label: "w-full flex items-center font-semibold text-highlighted",
    separator: "-mx-1 my-1 h-px bg-border",
    item: "group relative w-full flex items-center select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75",
    itemLeadingIcon: "shrink-0",
    itemLeadingAvatar: "shrink-0",
    itemLeadingAvatarSize: "",
    itemTrailing: "ms-auto inline-flex gap-1.5 items-center",
    itemTrailingIcon: "shrink-0",
    itemTrailingKbds: "hidden lg:inline-flex items-center shrink-0",
    itemTrailingKbdsSize: "",
    itemLabel: "truncate",
    itemLabelExternalIcon: "inline-block size-3 align-top text-dimmed"
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, ""])),
      neutral: ""
    },
    active: {
      true: {
        item: "text-highlighted before:bg-elevated",
        itemLeadingIcon: "text-default"
      },
      false: {
        item: ["text-default data-highlighted:text-highlighted data-[state=open]:text-highlighted data-highlighted:before:bg-elevated/50 data-[state=open]:before:bg-elevated/50", options.theme.transitions && "transition-colors before:transition-colors"],
        itemLeadingIcon: ["text-dimmed group-data-highlighted:text-default group-data-[state=open]:text-default", options.theme.transitions && "transition-colors"]
      }
    },
    loading: {
      true: {
        itemLeadingIcon: "animate-spin"
      }
    },
    size: {
      xs: {
        label: "p-1 text-xs gap-1",
        item: "p-1 text-xs gap-1",
        itemLeadingIcon: "size-4",
        itemLeadingAvatarSize: "3xs",
        itemTrailingIcon: "size-4",
        itemTrailingKbds: "gap-0.5",
        itemTrailingKbdsSize: "sm"
      },
      sm: {
        label: "p-1.5 text-xs gap-1.5",
        item: "p-1.5 text-xs gap-1.5",
        itemLeadingIcon: "size-4",
        itemLeadingAvatarSize: "3xs",
        itemTrailingIcon: "size-4",
        itemTrailingKbds: "gap-0.5",
        itemTrailingKbdsSize: "sm"
      },
      md: {
        label: "p-1.5 text-sm gap-1.5",
        item: "p-1.5 text-sm gap-1.5",
        itemLeadingIcon: "size-5",
        itemLeadingAvatarSize: "2xs",
        itemTrailingIcon: "size-5",
        itemTrailingKbds: "gap-0.5",
        itemTrailingKbdsSize: "md"
      },
      lg: {
        label: "p-2 text-sm gap-2",
        item: "p-2 text-sm gap-2",
        itemLeadingIcon: "size-5",
        itemLeadingAvatarSize: "2xs",
        itemTrailingIcon: "size-5",
        itemTrailingKbds: "gap-1",
        itemTrailingKbdsSize: "md"
      },
      xl: {
        label: "p-2 text-base gap-2",
        item: "p-2 text-base gap-2",
        itemLeadingIcon: "size-6",
        itemLeadingAvatarSize: "xs",
        itemTrailingIcon: "size-6",
        itemTrailingKbds: "gap-1",
        itemTrailingKbdsSize: "lg"
      }
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color) => ({
    color,
    active: false,
    class: {
      item: `text-${color} data-highlighted:text-${color} data-highlighted:before:bg-${color}/10 data-[state=open]:before:bg-${color}/10`,
      itemLeadingIcon: `text-${color}/75 group-data-highlighted:text-${color} group-data-[state=open]:text-${color}`
    }
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    active: true,
    class: {
      item: `text-${color} before:bg-${color}/10`,
      itemLeadingIcon: `text-${color}`
    }
  }))],
  defaultVariants: {
    size: "md"
  }
});

const fileUpload = (options) => ({
  slots: {
    root: "relative flex flex-col",
    base: ["w-full flex-1 bg-default border border-default flex flex-col gap-2 items-stretch justify-center rounded-lg focus-visible:outline-2", options.theme.transitions && "transition-[background]"],
    wrapper: "flex flex-col items-center justify-center text-center",
    icon: "shrink-0",
    avatar: "shrink-0",
    label: "font-medium text-default mt-2",
    description: "text-muted mt-1",
    actions: "flex flex-wrap gap-1.5 shrink-0 mt-4",
    files: "",
    file: "relative",
    fileLeadingAvatar: "shrink-0",
    fileWrapper: "flex flex-col min-w-0",
    fileName: "text-default truncate",
    fileSize: "text-muted truncate",
    fileTrailingButton: ""
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, ""])),
      neutral: ""
    },
    variant: {
      area: {
        wrapper: "px-4 py-3",
        base: "p-4"
      },
      button: {}
    },
    size: {
      xs: {
        base: "text-xs",
        icon: "size-4",
        file: "text-xs px-2 py-1 gap-1",
        fileWrapper: "flex-row gap-1"
      },
      sm: {
        base: "text-xs",
        icon: "size-4",
        file: "text-xs px-2.5 py-1.5 gap-1.5",
        fileWrapper: "flex-row gap-1"
      },
      md: {
        base: "text-sm",
        icon: "size-5",
        file: "text-xs px-2.5 py-1.5 gap-1.5"
      },
      lg: {
        base: "text-sm",
        icon: "size-5",
        file: "text-sm px-3 py-2 gap-2",
        fileSize: "text-xs"
      },
      xl: {
        base: "text-base",
        icon: "size-6",
        file: "text-sm px-3 py-2 gap-2"
      }
    },
    layout: {
      list: {
        root: "gap-2 items-start",
        files: "flex flex-col w-full gap-2",
        file: "min-w-0 flex items-center border border-default rounded-md w-full",
        fileTrailingButton: "ms-auto"
      },
      grid: {
        fileWrapper: "hidden",
        fileLeadingAvatar: "size-full rounded-lg",
        fileTrailingButton: "absolute -top-1.5 -end-1.5 p-0 rounded-full border-2 border-bg"
      }
    },
    position: {
      inside: "",
      outside: ""
    },
    dropzone: {
      true: "border-dashed data-[dragging=true]:bg-elevated/25"
    },
    interactive: {
      true: ""
    },
    highlight: {
      true: ""
    },
    multiple: {
      true: ""
    },
    disabled: {
      true: "cursor-not-allowed opacity-75"
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color) => ({
    color,
    class: `focus-visible:outline-${color}`
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    highlight: true,
    class: `border-${color}`
  })), {
    color: "neutral",
    class: "focus-visible:outline-inverted"
  }, {
    color: "neutral",
    highlight: true,
    class: "border-inverted"
  }, {
    size: "xs",
    layout: "list",
    class: {
      fileTrailingButton: "-me-1"
    }
  }, {
    size: "sm",
    layout: "list",
    class: {
      fileTrailingButton: "-me-1.5"
    }
  }, {
    size: "md",
    layout: "list",
    class: {
      fileTrailingButton: "-me-1.5"
    }
  }, {
    size: "lg",
    layout: "list",
    class: {
      fileTrailingButton: "-me-2"
    }
  }, {
    size: "xl",
    layout: "list",
    class: {
      fileTrailingButton: "-me-2"
    }
  }, {
    variant: "button",
    size: "xs",
    class: {
      base: "p-1"
    }
  }, {
    variant: "button",
    size: "sm",
    class: {
      base: "p-1.5"
    }
  }, {
    variant: "button",
    size: "md",
    class: {
      base: "p-1.5"
    }
  }, {
    variant: "button",
    size: "lg",
    class: {
      base: "p-2"
    }
  }, {
    variant: "button",
    size: "xl",
    class: {
      base: "p-2"
    }
  }, {
    layout: "grid",
    multiple: true,
    class: {
      files: "grid grid-cols-2 md:grid-cols-3 gap-4 w-full",
      file: "p-0 aspect-square"
    }
  }, {
    layout: "grid",
    multiple: false,
    class: {
      file: "absolute inset-0 p-0"
    }
  }, {
    interactive: true,
    disabled: false,
    class: "hover:bg-elevated/25"
  }],
  defaultVariants: {
    color: "primary",
    variant: "area",
    size: "md"
  }
});

const form = {
  base: ""
};

const formField = {
  slots: {
    root: "",
    wrapper: "",
    labelWrapper: "flex content-center items-center justify-between",
    label: "block font-medium text-default",
    container: "mt-1 relative",
    description: "text-muted",
    error: "mt-2 text-error",
    hint: "text-muted",
    help: "mt-2 text-muted"
  },
  variants: {
    size: {
      xs: { root: "text-xs" },
      sm: { root: "text-xs" },
      md: { root: "text-sm" },
      lg: { root: "text-sm" },
      xl: { root: "text-base" }
    },
    required: {
      true: {
        label: `after:content-['*'] after:ms-0.5 after:text-error`
      }
    }
  },
  defaultVariants: {
    size: "md"
  }
};

const input = (options) => ({
  slots: {
    root: "relative inline-flex items-center",
    base: ["w-full rounded-md border-0 appearance-none placeholder:text-dimmed focus:outline-none disabled:cursor-not-allowed disabled:opacity-75", options.theme.transitions && "transition-colors"],
    leading: "absolute inset-y-0 start-0 flex items-center",
    leadingIcon: "shrink-0 text-dimmed",
    leadingAvatar: "shrink-0",
    leadingAvatarSize: "",
    trailing: "absolute inset-y-0 end-0 flex items-center",
    trailingIcon: "shrink-0 text-dimmed"
  },
  variants: {
    ...buttonGroupVariantWithRoot,
    size: {
      xs: {
        base: "px-2 py-1 text-xs gap-1",
        leading: "ps-2",
        trailing: "pe-2",
        leadingIcon: "size-4",
        leadingAvatarSize: "3xs",
        trailingIcon: "size-4"
      },
      sm: {
        base: "px-2.5 py-1.5 text-xs gap-1.5",
        leading: "ps-2.5",
        trailing: "pe-2.5",
        leadingIcon: "size-4",
        leadingAvatarSize: "3xs",
        trailingIcon: "size-4"
      },
      md: {
        base: "px-2.5 py-1.5 text-sm gap-1.5",
        leading: "ps-2.5",
        trailing: "pe-2.5",
        leadingIcon: "size-5",
        leadingAvatarSize: "2xs",
        trailingIcon: "size-5"
      },
      lg: {
        base: "px-3 py-2 text-sm gap-2",
        leading: "ps-3",
        trailing: "pe-3",
        leadingIcon: "size-5",
        leadingAvatarSize: "2xs",
        trailingIcon: "size-5"
      },
      xl: {
        base: "px-3 py-2 text-base gap-2",
        leading: "ps-3",
        trailing: "pe-3",
        leadingIcon: "size-6",
        leadingAvatarSize: "xs",
        trailingIcon: "size-6"
      }
    },
    variant: {
      outline: "text-highlighted bg-default ring ring-inset ring-accented",
      soft: "text-highlighted bg-elevated/50 hover:bg-elevated focus:bg-elevated disabled:bg-elevated/50",
      subtle: "text-highlighted bg-elevated ring ring-inset ring-accented",
      ghost: "text-highlighted bg-transparent hover:bg-elevated focus:bg-elevated disabled:bg-transparent dark:disabled:bg-transparent",
      none: "text-highlighted bg-transparent"
    },
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, ""])),
      neutral: ""
    },
    leading: {
      true: ""
    },
    trailing: {
      true: ""
    },
    loading: {
      true: ""
    },
    highlight: {
      true: ""
    },
    type: {
      file: "file:me-1.5 file:font-medium file:text-muted file:outline-none"
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color) => ({
    color,
    variant: ["outline", "subtle"],
    class: `focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-${color}`
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    highlight: true,
    class: `ring ring-inset ring-${color}`
  })), {
    color: "neutral",
    variant: ["outline", "subtle"],
    class: "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-inverted"
  }, {
    color: "neutral",
    highlight: true,
    class: "ring ring-inset ring-inverted"
  }, {
    leading: true,
    size: "xs",
    class: "ps-7"
  }, {
    leading: true,
    size: "sm",
    class: "ps-8"
  }, {
    leading: true,
    size: "md",
    class: "ps-9"
  }, {
    leading: true,
    size: "lg",
    class: "ps-10"
  }, {
    leading: true,
    size: "xl",
    class: "ps-11"
  }, {
    trailing: true,
    size: "xs",
    class: "pe-7"
  }, {
    trailing: true,
    size: "sm",
    class: "pe-8"
  }, {
    trailing: true,
    size: "md",
    class: "pe-9"
  }, {
    trailing: true,
    size: "lg",
    class: "pe-10"
  }, {
    trailing: true,
    size: "xl",
    class: "pe-11"
  }, {
    loading: true,
    leading: true,
    class: {
      leadingIcon: "animate-spin"
    }
  }, {
    loading: true,
    leading: false,
    trailing: true,
    class: {
      trailingIcon: "animate-spin"
    }
  }],
  defaultVariants: {
    size: "md",
    color: "primary",
    variant: "outline"
  }
});

const inputMenu = (options) => {
  return defuFn({
    slots: {
      base: () => ["rounded-md", options.theme.transitions && "transition-colors"],
      trailing: "group absolute inset-y-0 end-0 flex items-center disabled:cursor-not-allowed disabled:opacity-75",
      arrow: "fill-default",
      content: "max-h-60 w-(--reka-combobox-trigger-width) bg-default shadow-lg rounded-md ring ring-default overflow-hidden data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] origin-(--reka-combobox-content-transform-origin) pointer-events-auto flex flex-col",
      viewport: "relative divide-y divide-default scroll-py-1 overflow-y-auto flex-1",
      group: "p-1 isolate",
      empty: "text-center text-muted",
      label: "font-semibold text-highlighted",
      separator: "-mx-1 my-1 h-px bg-border",
      item: ["group relative w-full flex items-center gap-1.5 p-1.5 text-sm select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75 text-default data-highlighted:not-data-disabled:text-highlighted data-highlighted:not-data-disabled:before:bg-elevated/50", options.theme.transitions && "transition-colors before:transition-colors"],
      itemLeadingIcon: ["shrink-0 text-dimmed group-data-highlighted:not-group-data-disabled:text-default", options.theme.transitions && "transition-colors"],
      itemLeadingAvatar: "shrink-0",
      itemLeadingAvatarSize: "",
      itemLeadingChip: "shrink-0",
      itemLeadingChipSize: "",
      itemTrailing: "ms-auto inline-flex gap-1.5 items-center",
      itemTrailingIcon: "shrink-0",
      itemLabel: "truncate",
      tagsItem: "px-1.5 py-0.5 rounded-sm font-medium inline-flex items-center gap-0.5 ring ring-inset ring-accented bg-elevated text-default data-disabled:cursor-not-allowed data-disabled:opacity-75",
      tagsItemText: "truncate",
      tagsItemDelete: ["inline-flex items-center rounded-xs text-dimmed hover:text-default hover:bg-accented/75 disabled:pointer-events-none", options.theme.transitions && "transition-colors"],
      tagsItemDeleteIcon: "shrink-0",
      tagsInput: "flex-1 border-0 bg-transparent placeholder:text-dimmed focus:outline-none disabled:cursor-not-allowed disabled:opacity-75"
    },
    variants: {
      multiple: {
        true: {
          root: "flex-wrap"
        },
        false: {
          base: "w-full border-0 placeholder:text-dimmed focus:outline-none disabled:cursor-not-allowed disabled:opacity-75"
        }
      },
      size: {
        xs: {
          label: "p-1 text-[10px]/3 gap-1",
          item: "p-1 text-xs gap-1",
          itemLeadingIcon: "size-4",
          itemLeadingAvatarSize: "3xs",
          itemLeadingChip: "size-4",
          itemLeadingChipSize: "sm",
          itemTrailingIcon: "size-4",
          tagsItem: "text-[10px]/3",
          tagsItemDeleteIcon: "size-3",
          empty: "p-1 text-xs"
        },
        sm: {
          label: "p-1.5 text-[10px]/3 gap-1.5",
          item: "p-1.5 text-xs gap-1.5",
          itemLeadingIcon: "size-4",
          itemLeadingAvatarSize: "3xs",
          itemLeadingChip: "size-4",
          itemLeadingChipSize: "sm",
          itemTrailingIcon: "size-4",
          tagsItem: "text-[10px]/3",
          tagsItemDeleteIcon: "size-3",
          empty: "p-1.5 text-xs"
        },
        md: {
          label: "p-1.5 text-xs gap-1.5",
          item: "p-1.5 text-sm gap-1.5",
          itemLeadingIcon: "size-5",
          itemLeadingAvatarSize: "2xs",
          itemLeadingChip: "size-5",
          itemLeadingChipSize: "md",
          itemTrailingIcon: "size-5",
          tagsItem: "text-xs",
          tagsItemDeleteIcon: "size-3.5",
          empty: "p-1.5 text-sm"
        },
        lg: {
          label: "p-2 text-xs gap-2",
          item: "p-2 text-sm gap-2",
          itemLeadingIcon: "size-5",
          itemLeadingAvatarSize: "2xs",
          itemLeadingChip: "size-5",
          itemLeadingChipSize: "md",
          itemTrailingIcon: "size-5",
          tagsItem: "text-xs",
          tagsItemDeleteIcon: "size-3.5",
          empty: "p-2 text-sm"
        },
        xl: {
          label: "p-2 text-sm gap-2",
          item: "p-2 text-base gap-2",
          itemLeadingIcon: "size-6",
          itemLeadingAvatarSize: "xs",
          itemLeadingChip: "size-6",
          itemLeadingChipSize: "lg",
          itemTrailingIcon: "size-6",
          tagsItem: "text-sm",
          tagsItemDeleteIcon: "size-4",
          empty: "p-2 text-base"
        }
      }
    },
    compoundVariants: [{
      variant: "soft",
      multiple: true,
      class: "has-focus:bg-elevated"
    }, {
      variant: "ghost",
      multiple: true,
      class: "has-focus:bg-elevated"
    }, ...(options.theme.colors || []).map((color) => ({
      color,
      multiple: true,
      variant: ["outline", "subtle"],
      class: `has-focus-visible:ring-2 has-focus-visible:ring-${color}`
    })), {
      color: "neutral",
      multiple: true,
      variant: ["outline", "subtle"],
      class: "has-focus-visible:ring-2 has-focus-visible:ring-inverted"
    }]
  }, input(options));
};

const inputNumber = (options) => {
  const input$1 = input(options);
  return {
    slots: {
      root: "relative inline-flex items-center",
      base: ["w-full rounded-md border-0 placeholder:text-dimmed focus:outline-none disabled:cursor-not-allowed disabled:opacity-75", options.theme.transitions && "transition-colors"],
      increment: "absolute flex items-center",
      decrement: "absolute flex items-center"
    },
    variants: {
      ...buttonGroupVariantWithRoot,
      color: {
        ...Object.fromEntries((options.theme.colors || []).map((color) => [color, ""])),
        neutral: ""
      },
      size: {
        xs: "px-2 py-1 text-xs gap-1",
        sm: "px-2.5 py-1.5 text-xs gap-1.5",
        md: "px-2.5 py-1.5 text-sm gap-1.5",
        lg: "px-3 py-2 text-sm gap-2",
        xl: "px-3 py-2 text-base gap-2"
      },
      variant: {
        ...input$1.variants.variant
      },
      disabled: {
        true: {
          increment: "opacity-75 cursor-not-allowed",
          decrement: "opacity-75 cursor-not-allowed"
        }
      },
      orientation: {
        horizontal: {
          base: "text-center",
          increment: "inset-y-0 end-0 pe-1",
          decrement: "inset-y-0 start-0 ps-1"
        },
        vertical: {
          increment: "top-0 end-0 pe-1 [&>button]:py-0 scale-80",
          decrement: "bottom-0 end-0 pe-1 [&>button]:py-0 scale-80"
        }
      },
      highlight: {
        true: ""
      }
    },
    compoundVariants: [...(options.theme.colors || []).map((color) => ({
      color,
      variant: ["outline", "subtle"],
      class: `focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-${color}`
    })), ...(options.theme.colors || []).map((color) => ({
      color,
      highlight: true,
      class: `ring ring-inset ring-${color}`
    })), {
      color: "neutral",
      variant: ["outline", "subtle"],
      class: "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-inverted"
    }, {
      color: "neutral",
      highlight: true,
      class: "ring ring-inset ring-inverted"
    }, {
      orientation: "horizontal",
      size: "xs",
      class: "px-7"
    }, {
      orientation: "horizontal",
      size: "sm",
      class: "px-8"
    }, {
      orientation: "horizontal",
      size: "md",
      class: "px-9"
    }, {
      orientation: "horizontal",
      size: "lg",
      class: "px-10"
    }, {
      orientation: "horizontal",
      size: "xl",
      class: "px-11"
    }, {
      orientation: "vertical",
      size: "xs",
      class: "pe-7"
    }, {
      orientation: "vertical",
      size: "sm",
      class: "pe-8"
    }, {
      orientation: "vertical",
      size: "md",
      class: "pe-9"
    }, {
      orientation: "vertical",
      size: "lg",
      class: "pe-10"
    }, {
      orientation: "vertical",
      size: "xl",
      class: "pe-11"
    }],
    defaultVariants: {
      size: "md",
      color: "primary",
      variant: "outline"
    }
  };
};

const inputTags = (options) => {
  return defuFn({
    slots: {
      root: (prev) => [prev, "flex-wrap"],
      base: () => ["rounded-md", options.theme.transitions && "transition-colors"],
      item: 'px-1.5 py-0.5 rounded-sm font-medium inline-flex items-center gap-0.5 ring ring-inset ring-accented bg-elevated text-default data-disabled:cursor-not-allowed data-disabled:opacity-75 wrap-anywhere data-[state="active"]:bg-accented',
      itemText: "",
      itemDelete: ["inline-flex items-center rounded-xs text-dimmed hover:text-default hover:bg-accented/75 disabled:pointer-events-none", options.theme.transitions && "transition-colors"],
      itemDeleteIcon: "shrink-0",
      input: "flex-1 border-0 bg-transparent placeholder:text-dimmed focus:outline-none disabled:cursor-not-allowed disabled:opacity-75"
    },
    variants: {
      size: {
        xs: {
          item: "text-[10px]/3",
          itemDeleteIcon: "size-3"
        },
        sm: {
          item: "text-[10px]/3",
          itemDeleteIcon: "size-3"
        },
        md: {
          item: "text-xs",
          itemDeleteIcon: "size-3.5"
        },
        lg: {
          item: "text-xs",
          itemDeleteIcon: "size-3.5"
        },
        xl: {
          item: "text-sm",
          itemDeleteIcon: "size-4"
        }
      },
      variant: (prev) => Object.fromEntries(
        Object.entries(prev).map(([key, value]) => [key, replaceFocus$2(value)])
      )
    },
    compoundVariants: (prev) => prev.map((item) => ({
      ...item,
      class: typeof item.class === "string" ? replaceFocus$2(item.class) : item.class
    }))
  }, input(options));
};
function replaceFocus$2(str) {
  return str.replace(/focus:/g, "has-focus:").replace(/focus-visible:/g, "has-focus-visible:");
}

const kbd = (options) => ({
  base: "inline-flex items-center justify-center px-1 rounded-sm font-medium font-sans",
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, ""])),
      neutral: ""
    },
    variant: {
      solid: "",
      outline: "",
      soft: "",
      subtle: ""
    },
    size: {
      sm: "h-4 min-w-[16px] text-[10px]",
      md: "h-5 min-w-[20px] text-[11px]",
      lg: "h-6 min-w-[24px] text-[12px]"
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color) => ({
    color,
    variant: "solid",
    class: `text-inverted bg-${color}`
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "outline",
    class: `ring ring-inset ring-${color}/50 text-${color}`
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "soft",
    class: `text-${color} bg-${color}/10`
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "subtle",
    class: `text-${color} ring ring-inset ring-${color}/25 bg-${color}/10`
  })), {
    color: "neutral",
    variant: "solid",
    class: "text-inverted bg-inverted"
  }, {
    color: "neutral",
    variant: "outline",
    class: "ring ring-inset ring-accented text-default bg-default"
  }, {
    color: "neutral",
    variant: "soft",
    class: "text-default bg-elevated"
  }, {
    color: "neutral",
    variant: "subtle",
    class: "ring ring-inset ring-accented text-default bg-elevated"
  }],
  defaultVariants: {
    variant: "outline",
    color: "neutral",
    size: "md"
  }
});

const link = (options) => ({
  base: "focus-visible:outline-primary",
  variants: {
    active: {
      true: "text-primary",
      false: "text-muted"
    },
    disabled: {
      true: "cursor-not-allowed opacity-75"
    }
  },
  compoundVariants: [{
    active: false,
    disabled: false,
    class: ["hover:text-default", options.theme.transitions && "transition-colors"]
  }]
});

const modal = {
  slots: {
    overlay: "fixed inset-0 bg-elevated/75",
    content: "fixed bg-default divide-y divide-default flex flex-col focus:outline-none",
    header: "flex items-center gap-1.5 p-4 sm:px-6 min-h-16",
    wrapper: "",
    body: "flex-1 overflow-y-auto p-4 sm:p-6",
    footer: "flex items-center gap-1.5 p-4 sm:px-6",
    title: "text-highlighted font-semibold",
    description: "mt-1 text-muted text-sm",
    close: "absolute top-4 end-4"
  },
  variants: {
    transition: {
      true: {
        overlay: "data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_200ms_ease-in]",
        content: "data-[state=open]:animate-[scale-in_200ms_ease-out] data-[state=closed]:animate-[scale-out_200ms_ease-in]"
      }
    },
    fullscreen: {
      true: {
        content: "inset-0"
      },
      false: {
        content: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-lg max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] rounded-lg shadow-lg ring ring-default overflow-hidden"
      }
    }
  }
};

const navigationMenu = (options) => ({
  slots: {
    root: "relative flex gap-1.5 [&>div]:min-w-0",
    list: "isolate min-w-0",
    label: "w-full flex items-center gap-1.5 font-semibold text-xs/5 text-highlighted px-2.5 py-1.5",
    item: "min-w-0",
    link: "group relative w-full flex items-center gap-1.5 font-medium text-sm before:absolute before:z-[-1] before:rounded-md focus:outline-none focus-visible:outline-none dark:focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-2",
    linkLeadingIcon: "shrink-0 size-5",
    linkLeadingAvatar: "shrink-0",
    linkLeadingAvatarSize: "2xs",
    linkTrailing: "group ms-auto inline-flex gap-1.5 items-center",
    linkTrailingBadge: "shrink-0",
    linkTrailingBadgeSize: "sm",
    linkTrailingIcon: "size-5 transform shrink-0 group-data-[state=open]:rotate-180 transition-transform duration-200",
    linkLabel: "truncate",
    linkLabelExternalIcon: "inline-block size-3 align-top text-dimmed",
    childList: "isolate",
    childLabel: "text-xs text-highlighted",
    childItem: "",
    childLink: "group relative size-full flex items-start text-start text-sm before:absolute before:z-[-1] before:rounded-md focus:outline-none focus-visible:outline-none dark:focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-2",
    childLinkWrapper: "min-w-0",
    childLinkIcon: "size-5 shrink-0",
    childLinkLabel: "truncate",
    childLinkLabelExternalIcon: "inline-block size-3 align-top text-dimmed",
    childLinkDescription: "text-muted",
    separator: "px-2 h-px bg-border",
    viewportWrapper: "absolute top-full left-0 flex w-full",
    viewport: "relative overflow-hidden bg-default shadow-lg rounded-md ring ring-default h-(--reka-navigation-menu-viewport-height) w-full transition-[width,height,left] duration-200 origin-[top_center] data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] z-[1]",
    content: "",
    indicator: "absolute data-[state=visible]:animate-[fade-in_100ms_ease-out] data-[state=hidden]:animate-[fade-out_100ms_ease-in] data-[state=hidden]:opacity-0 bottom-0 z-[2] w-(--reka-navigation-menu-indicator-size) translate-x-(--reka-navigation-menu-indicator-position) flex h-2.5 items-end justify-center overflow-hidden transition-[translate,width] duration-200",
    arrow: "relative top-[50%] size-2.5 rotate-45 border border-default bg-default z-[1] rounded-xs"
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, {
        link: `focus-visible:before:ring-${color}`,
        childLink: `focus-visible:before:ring-${color}`
      }])),
      neutral: {
        link: "focus-visible:before:ring-inverted",
        childLink: "focus-visible:before:ring-inverted"
      }
    },
    highlightColor: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, ""])),
      neutral: ""
    },
    variant: {
      pill: "",
      link: ""
    },
    orientation: {
      horizontal: {
        root: "items-center justify-between",
        list: "flex items-center",
        item: "py-2",
        link: "px-2.5 py-1.5 before:inset-x-px before:inset-y-0",
        childList: "grid p-2",
        childLink: "px-3 py-2 gap-2 before:inset-x-px before:inset-y-0",
        childLinkLabel: "font-medium",
        content: "absolute top-0 left-0 w-full max-h-[70vh] overflow-y-auto"
      },
      vertical: {
        root: "flex-col",
        link: "flex-row px-2.5 py-1.5 before:inset-y-px before:inset-x-0",
        childLabel: "px-1.5 py-0.5",
        childLink: "p-1.5 gap-1.5 before:inset-y-px before:inset-x-0"
      }
    },
    contentOrientation: {
      horizontal: {
        viewportWrapper: "justify-center",
        content: "data-[motion=from-start]:animate-[enter-from-left_200ms_ease] data-[motion=from-end]:animate-[enter-from-right_200ms_ease] data-[motion=to-start]:animate-[exit-to-left_200ms_ease] data-[motion=to-end]:animate-[exit-to-right_200ms_ease]"
      },
      vertical: {
        viewport: "sm:w-(--reka-navigation-menu-viewport-width) left-(--reka-navigation-menu-viewport-left)"
      }
    },
    active: {
      true: {
        childLink: "before:bg-elevated text-highlighted",
        childLinkIcon: "text-default"
      },
      false: {
        link: "text-muted",
        linkLeadingIcon: "text-dimmed",
        childLink: ["hover:before:bg-elevated/50 text-default hover:text-highlighted", options.theme.transitions && "transition-colors before:transition-colors"],
        childLinkIcon: ["text-dimmed group-hover:text-default", options.theme.transitions && "transition-colors"]
      }
    },
    disabled: {
      true: {
        link: "cursor-not-allowed opacity-75"
      }
    },
    highlight: {
      true: ""
    },
    level: {
      true: ""
    },
    collapsed: {
      true: ""
    }
  },
  compoundVariants: [{
    orientation: "horizontal",
    contentOrientation: "horizontal",
    class: {
      childList: "grid-cols-2 gap-2"
    }
  }, {
    orientation: "horizontal",
    contentOrientation: "vertical",
    class: {
      childList: "gap-1",
      content: "w-60"
    }
  }, {
    orientation: "vertical",
    collapsed: false,
    class: {
      childList: "ms-5 border-s border-default",
      childItem: "ps-1.5 -ms-px",
      content: "data-[state=open]:animate-[collapsible-down_200ms_ease-out] data-[state=closed]:animate-[collapsible-up_200ms_ease-out] overflow-hidden"
    }
  }, {
    orientation: "vertical",
    collapsed: true,
    class: {
      link: "px-1.5",
      content: "shadow-sm rounded-sm min-h-6 p-1"
    }
  }, {
    orientation: "horizontal",
    highlight: true,
    class: {
      link: ["after:absolute after:-bottom-2 after:inset-x-2.5 after:block after:h-px after:rounded-full", options.theme.transitions && "after:transition-colors"]
    }
  }, {
    orientation: "vertical",
    highlight: true,
    level: true,
    class: {
      link: ["after:absolute after:-start-1.5 after:inset-y-0.5 after:block after:w-px after:rounded-full", options.theme.transitions && "after:transition-colors"]
    }
  }, {
    disabled: false,
    active: false,
    variant: "pill",
    class: {
      link: ["hover:text-highlighted hover:before:bg-elevated/50", options.theme.transitions && "transition-colors before:transition-colors"],
      linkLeadingIcon: ["group-hover:text-default", options.theme.transitions && "transition-colors"]
    }
  }, {
    disabled: false,
    active: false,
    variant: "pill",
    orientation: "horizontal",
    class: {
      link: "data-[state=open]:text-highlighted",
      linkLeadingIcon: "group-data-[state=open]:text-default"
    }
  }, {
    disabled: false,
    variant: "pill",
    highlight: true,
    orientation: "horizontal",
    class: {
      link: "data-[state=open]:before:bg-elevated/50"
    }
  }, {
    disabled: false,
    variant: "pill",
    highlight: false,
    active: false,
    orientation: "horizontal",
    class: {
      link: "data-[state=open]:before:bg-elevated/50"
    }
  }, ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "pill",
    active: true,
    class: {
      link: `text-${color}`,
      linkLeadingIcon: `text-${color} group-data-[state=open]:text-${color}`
    }
  })), {
    color: "neutral",
    variant: "pill",
    active: true,
    class: {
      link: "text-highlighted",
      linkLeadingIcon: "text-highlighted group-data-[state=open]:text-highlighted"
    }
  }, {
    variant: "pill",
    active: true,
    highlight: false,
    class: {
      link: "before:bg-elevated"
    }
  }, {
    variant: "pill",
    active: true,
    highlight: true,
    disabled: false,
    class: {
      link: ["hover:before:bg-elevated/50", options.theme.transitions && "before:transition-colors"]
    }
  }, {
    disabled: false,
    active: false,
    variant: "link",
    class: {
      link: ["hover:text-highlighted", options.theme.transitions && "transition-colors"],
      linkLeadingIcon: ["group-hover:text-default", options.theme.transitions && "transition-colors"]
    }
  }, {
    disabled: false,
    active: false,
    variant: "link",
    orientation: "horizontal",
    class: {
      link: "data-[state=open]:text-highlighted",
      linkLeadingIcon: "group-data-[state=open]:text-default"
    }
  }, ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "link",
    active: true,
    class: {
      link: `text-${color}`,
      linkLeadingIcon: `text-${color} group-data-[state=open]:text-${color}`
    }
  })), {
    color: "neutral",
    variant: "link",
    active: true,
    class: {
      link: "text-highlighted",
      linkLeadingIcon: "text-highlighted group-data-[state=open]:text-highlighted"
    }
  }, ...(options.theme.colors || []).map((highlightColor) => ({
    highlightColor,
    highlight: true,
    level: true,
    active: true,
    class: {
      link: `after:bg-${highlightColor}`
    }
  })), {
    highlightColor: "neutral",
    highlight: true,
    level: true,
    active: true,
    class: {
      link: "after:bg-inverted"
    }
  }],
  defaultVariants: {
    color: "primary",
    highlightColor: "primary",
    variant: "pill"
  }
});

const pagination = {
  slots: {
    root: "",
    list: "flex items-center gap-1",
    ellipsis: "pointer-events-none",
    label: "min-w-5 text-center",
    first: "",
    prev: "",
    item: "",
    next: "",
    last: ""
  }
};

const pinInput = (options) => ({
  slots: {
    root: "relative inline-flex items-center gap-1.5",
    base: ["rounded-md border-0 placeholder:text-dimmed text-center focus:outline-none disabled:cursor-not-allowed disabled:opacity-75", options.theme.transitions && "transition-colors"]
  },
  variants: {
    size: {
      xs: {
        base: "size-6 text-xs"
      },
      sm: {
        base: "size-7 text-xs"
      },
      md: {
        base: "size-8 text-sm"
      },
      lg: {
        base: "size-9 text-sm"
      },
      xl: {
        base: "size-10 text-base"
      }
    },
    variant: {
      outline: "text-highlighted bg-default ring ring-inset ring-accented",
      soft: "text-highlighted bg-elevated/50 hover:bg-elevated focus:bg-elevated disabled:bg-elevated/50",
      subtle: "text-highlighted bg-elevated ring ring-inset ring-accented",
      ghost: "text-highlighted bg-transparent hover:bg-elevated focus:bg-elevated disabled:bg-transparent dark:disabled:bg-transparent",
      none: "text-highlighted bg-transparent"
    },
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, ""])),
      neutral: ""
    },
    highlight: {
      true: ""
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color) => ({
    color,
    variant: ["outline", "subtle"],
    class: `focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-${color}`
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    highlight: true,
    class: `ring ring-inset ring-${color}`
  })), {
    color: "neutral",
    variant: ["outline", "subtle"],
    class: "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-inverted"
  }, {
    color: "neutral",
    highlight: true,
    class: "ring ring-inset ring-inverted"
  }],
  defaultVariants: {
    size: "md",
    color: "primary",
    variant: "outline"
  }
});

const popover = {
  slots: {
    content: "bg-default shadow-lg rounded-md ring ring-default data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] origin-(--reka-popover-content-transform-origin) focus:outline-none pointer-events-auto",
    arrow: "fill-default"
  }
};

const progress = (options) => ({
  slots: {
    root: "gap-2",
    base: "relative overflow-hidden rounded-full bg-accented",
    indicator: "rounded-full size-full transition-transform duration-200 ease-out",
    status: "flex justify-end text-dimmed transition-[width] duration-200",
    steps: "grid items-end",
    step: "truncate text-end row-start-1 col-start-1 transition-opacity"
  },
  variants: {
    animation: {
      "carousel": "",
      "carousel-inverse": "",
      "swing": "",
      "elastic": ""
    },
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, {
        indicator: `bg-${color}`,
        steps: `text-${color}`
      }])),
      neutral: {
        indicator: "bg-inverted",
        steps: "text-inverted"
      }
    },
    size: {
      "2xs": {
        status: "text-xs",
        steps: "text-xs"
      },
      "xs": {
        status: "text-xs",
        steps: "text-xs"
      },
      "sm": {
        status: "text-sm",
        steps: "text-sm"
      },
      "md": {
        status: "text-sm",
        steps: "text-sm"
      },
      "lg": {
        status: "text-sm",
        steps: "text-sm"
      },
      "xl": {
        status: "text-base",
        steps: "text-base"
      },
      "2xl": {
        status: "text-base",
        steps: "text-base"
      }
    },
    step: {
      active: {
        step: "opacity-100"
      },
      first: {
        step: "opacity-100 text-muted"
      },
      other: {
        step: "opacity-0"
      },
      last: {
        step: ""
      }
    },
    orientation: {
      horizontal: {
        root: "w-full flex flex-col",
        base: "w-full",
        status: "flex-row"
      },
      vertical: {
        root: "h-full flex flex-row-reverse",
        base: "h-full",
        status: "flex-col"
      }
    },
    inverted: {
      true: {
        status: "self-end"
      }
    }
  },
  compoundVariants: [{
    inverted: true,
    orientation: "horizontal",
    class: {
      step: "text-start",
      status: "flex-row-reverse"
    }
  }, {
    inverted: true,
    orientation: "vertical",
    class: {
      steps: "items-start",
      status: "flex-col-reverse"
    }
  }, {
    orientation: "horizontal",
    size: "2xs",
    class: "h-px"
  }, {
    orientation: "horizontal",
    size: "xs",
    class: "h-0.5"
  }, {
    orientation: "horizontal",
    size: "sm",
    class: "h-1"
  }, {
    orientation: "horizontal",
    size: "md",
    class: "h-2"
  }, {
    orientation: "horizontal",
    size: "lg",
    class: "h-3"
  }, {
    orientation: "horizontal",
    size: "xl",
    class: "h-4"
  }, {
    orientation: "horizontal",
    size: "2xl",
    class: "h-5"
  }, {
    orientation: "vertical",
    size: "2xs",
    class: "w-px"
  }, {
    orientation: "vertical",
    size: "xs",
    class: "w-0.5"
  }, {
    orientation: "vertical",
    size: "sm",
    class: "w-1"
  }, {
    orientation: "vertical",
    size: "md",
    class: "w-2"
  }, {
    orientation: "vertical",
    size: "lg",
    class: "w-3"
  }, {
    orientation: "vertical",
    size: "xl",
    class: "w-4"
  }, {
    orientation: "vertical",
    size: "2xl",
    class: "w-5"
  }, {
    orientation: "horizontal",
    animation: "carousel",
    class: {
      indicator: "data-[state=indeterminate]:animate-[carousel_2s_ease-in-out_infinite] data-[state=indeterminate]:rtl:animate-[carousel-rtl_2s_ease-in-out_infinite]"
    }
  }, {
    orientation: "vertical",
    animation: "carousel",
    class: {
      indicator: "data-[state=indeterminate]:animate-[carousel-vertical_2s_ease-in-out_infinite]"
    }
  }, {
    orientation: "horizontal",
    animation: "carousel-inverse",
    class: {
      indicator: "data-[state=indeterminate]:animate-[carousel-inverse_2s_ease-in-out_infinite] data-[state=indeterminate]:rtl:animate-[carousel-inverse-rtl_2s_ease-in-out_infinite]"
    }
  }, {
    orientation: "vertical",
    animation: "carousel-inverse",
    class: {
      indicator: "data-[state=indeterminate]:animate-[carousel-inverse-vertical_2s_ease-in-out_infinite]"
    }
  }, {
    orientation: "horizontal",
    animation: "swing",
    class: {
      indicator: "data-[state=indeterminate]:animate-[swing_2s_ease-in-out_infinite]"
    }
  }, {
    orientation: "vertical",
    animation: "swing",
    class: {
      indicator: "data-[state=indeterminate]:animate-[swing-vertical_2s_ease-in-out_infinite]"
    }
  }, {
    orientation: "horizontal",
    animation: "elastic",
    class: {
      indicator: "data-[state=indeterminate]:animate-[elastic_2s_ease-in-out_infinite]"
    }
  }, {
    orientation: "vertical",
    animation: "elastic",
    class: {
      indicator: "data-[state=indeterminate]:animate-[elastic-vertical_2s_ease-in-out_infinite]"
    }
  }],
  defaultVariants: {
    animation: "carousel",
    color: "primary",
    size: "md"
  }
});

const radioGroup = (options) => ({
  slots: {
    root: "relative",
    fieldset: "flex gap-x-2",
    legend: "mb-1 block font-medium text-default",
    item: "flex items-start",
    container: "flex items-center",
    base: "rounded-full ring ring-inset ring-accented overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2",
    indicator: "flex items-center justify-center size-full after:bg-default after:rounded-full",
    wrapper: "w-full",
    label: "block font-medium text-default",
    description: "text-muted"
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, {
        base: `focus-visible:outline-${color}`,
        indicator: `bg-${color}`
      }])),
      neutral: {
        base: "focus-visible:outline-inverted",
        indicator: "bg-inverted"
      }
    },
    variant: {
      list: {
        item: ""
      },
      card: {
        item: "border border-muted rounded-lg"
      },
      table: {
        item: "border border-muted"
      }
    },
    orientation: {
      horizontal: {
        fieldset: "flex-row"
      },
      vertical: {
        fieldset: "flex-col"
      }
    },
    indicator: {
      start: {
        item: "flex-row",
        wrapper: "ms-2"
      },
      end: {
        item: "flex-row-reverse",
        wrapper: "me-2"
      },
      hidden: {
        base: "sr-only",
        wrapper: "text-center"
      }
    },
    size: {
      xs: {
        fieldset: "gap-y-0.5",
        legend: "text-xs",
        base: "size-3",
        item: "text-xs",
        container: "h-4",
        indicator: "after:size-1"
      },
      sm: {
        fieldset: "gap-y-0.5",
        legend: "text-xs",
        base: "size-3.5",
        item: "text-xs",
        container: "h-4",
        indicator: "after:size-1"
      },
      md: {
        fieldset: "gap-y-1",
        legend: "text-sm",
        base: "size-4",
        item: "text-sm",
        container: "h-5",
        indicator: "after:size-1.5"
      },
      lg: {
        fieldset: "gap-y-1",
        legend: "text-sm",
        base: "size-4.5",
        item: "text-sm",
        container: "h-5",
        indicator: "after:size-1.5"
      },
      xl: {
        fieldset: "gap-y-1.5",
        legend: "text-base",
        base: "size-5",
        item: "text-base",
        container: "h-6",
        indicator: "after:size-2"
      }
    },
    disabled: {
      true: {
        base: "cursor-not-allowed opacity-75",
        label: "cursor-not-allowed opacity-75"
      }
    },
    required: {
      true: {
        legend: "after:content-['*'] after:ms-0.5 after:text-error"
      }
    }
  },
  compoundVariants: [
    { size: "xs", variant: ["card", "table"], class: { item: "p-2.5" } },
    { size: "sm", variant: ["card", "table"], class: { item: "p-3" } },
    { size: "md", variant: ["card", "table"], class: { item: "p-3.5" } },
    { size: "lg", variant: ["card", "table"], class: { item: "p-4" } },
    { size: "xl", variant: ["card", "table"], class: { item: "p-4.5" } },
    {
      orientation: "horizontal",
      variant: "table",
      class: {
        item: "first-of-type:rounded-s-lg last-of-type:rounded-e-lg",
        fieldset: "gap-0 -space-x-px"
      }
    },
    {
      orientation: "vertical",
      variant: "table",
      class: {
        item: "first-of-type:rounded-t-lg last-of-type:rounded-b-lg",
        fieldset: "gap-0 -space-y-px"
      }
    },
    ...(options.theme.colors || []).map((color) => ({
      color,
      variant: "card",
      class: {
        item: `has-data-[state=checked]:border-${color}`
      }
    })),
    {
      color: "neutral",
      variant: "card",
      class: {
        item: "has-data-[state=checked]:border-inverted"
      }
    },
    ...(options.theme.colors || []).map((color) => ({
      color,
      variant: "table",
      class: {
        item: `has-data-[state=checked]:bg-${color}/10 has-data-[state=checked]:border-${color}/50 has-data-[state=checked]:z-[1]`
      }
    })),
    {
      color: "neutral",
      variant: "table",
      class: {
        item: "has-data-[state=checked]:bg-elevated has-data-[state=checked]:border-inverted/50 has-data-[state=checked]:z-[1]"
      }
    },
    {
      variant: ["card", "table"],
      disabled: true,
      class: {
        item: "cursor-not-allowed opacity-75"
      }
    }
  ],
  defaultVariants: {
    size: "md",
    color: "primary",
    variant: "list",
    orientation: "vertical",
    indicator: "start"
  }
});

const select = (options) => {
  return defuFn({
    slots: {
      root: () => void 0,
      base: () => ["relative group rounded-md inline-flex items-center focus:outline-none disabled:cursor-not-allowed disabled:opacity-75", options.theme.transitions && "transition-colors"],
      value: "truncate pointer-events-none",
      placeholder: "truncate text-dimmed",
      arrow: "fill-default",
      content: "max-h-60 w-(--reka-select-trigger-width) bg-default shadow-lg rounded-md ring ring-default overflow-hidden data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] origin-(--reka-select-content-transform-origin) pointer-events-auto flex flex-col",
      viewport: "relative divide-y divide-default scroll-py-1 overflow-y-auto flex-1",
      group: "p-1 isolate",
      empty: "text-center text-muted",
      label: "font-semibold text-highlighted",
      separator: "-mx-1 my-1 h-px bg-border",
      item: ["group relative w-full flex items-center select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75 text-default data-highlighted:not-data-disabled:text-highlighted data-highlighted:not-data-disabled:before:bg-elevated/50", options.theme.transitions && "transition-colors before:transition-colors"],
      itemLeadingIcon: ["shrink-0 text-dimmed group-data-highlighted:not-group-data-disabled:text-default", options.theme.transitions && "transition-colors"],
      itemLeadingAvatar: "shrink-0",
      itemLeadingAvatarSize: "",
      itemLeadingChip: "shrink-0",
      itemLeadingChipSize: "",
      itemTrailing: "ms-auto inline-flex gap-1.5 items-center",
      itemTrailingIcon: "shrink-0",
      itemLabel: "truncate"
    },
    variants: {
      ...buttonGroupVariant,
      size: {
        xs: {
          label: "p-1 text-[10px]/3 gap-1",
          item: "p-1 text-xs gap-1",
          itemLeadingIcon: "size-4",
          itemLeadingAvatarSize: "3xs",
          itemLeadingChip: "size-4",
          itemLeadingChipSize: "sm",
          itemTrailingIcon: "size-4",
          empty: "p-1 text-xs"
        },
        sm: {
          label: "p-1.5 text-[10px]/3 gap-1.5",
          item: "p-1.5 text-xs gap-1.5",
          itemLeadingIcon: "size-4",
          itemLeadingAvatarSize: "3xs",
          itemLeadingChip: "size-4",
          itemLeadingChipSize: "sm",
          itemTrailingIcon: "size-4",
          empty: "p-1.5 text-xs"
        },
        md: {
          label: "p-1.5 text-xs gap-1.5",
          item: "p-1.5 text-sm gap-1.5",
          itemLeadingIcon: "size-5",
          itemLeadingAvatarSize: "2xs",
          itemLeadingChip: "size-5",
          itemLeadingChipSize: "md",
          itemTrailingIcon: "size-5",
          empty: "p-1.5 text-sm"
        },
        lg: {
          label: "p-2 text-xs gap-2",
          item: "p-2 text-sm gap-2",
          itemLeadingIcon: "size-5",
          itemLeadingAvatarSize: "2xs",
          itemLeadingChip: "size-5",
          itemLeadingChipSize: "md",
          itemTrailingIcon: "size-5",
          empty: "p-2 text-sm"
        },
        xl: {
          label: "p-2 text-sm gap-2",
          item: "p-2 text-base gap-2",
          itemLeadingIcon: "size-6",
          itemLeadingAvatarSize: "xs",
          itemLeadingChip: "size-6",
          itemLeadingChipSize: "lg",
          itemTrailingIcon: "size-6",
          empty: "p-2 text-base"
        }
      }
    },
    compoundVariants: (prev) => prev.map((item) => ({
      ...item,
      class: typeof item.class === "string" ? replaceFocus$1(item.class) : item.class
    }))
  }, input(options));
};
function replaceFocus$1(str) {
  return str.replace(/focus-visible:/g, "focus:");
}

const selectMenu = (options) => {
  return defuFn({
    slots: {
      input: "border-b border-default",
      focusScope: "flex flex-col min-h-0",
      content: (content) => [content, "origin-(--reka-combobox-content-transform-origin) w-(--reka-combobox-trigger-width)"]
    },
    compoundVariants: (prev) => prev.map((item) => ({
      ...item,
      class: typeof item.class === "string" ? replaceFocus(item.class) : item.class
    }))
  }, select(options));
};
function replaceFocus(str) {
  return str.replace(/focus:/g, "focus-visible:");
}

const separator = (options) => ({
  slots: {
    root: "flex items-center align-center text-center",
    border: "",
    container: "font-medium text-default flex",
    icon: "shrink-0 size-5",
    avatar: "shrink-0",
    avatarSize: "2xs",
    label: "text-sm"
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, { border: `border-${color}` }])),
      neutral: { border: "border-default" }
    },
    orientation: {
      horizontal: {
        root: "w-full flex-row",
        border: "w-full",
        container: "mx-3 whitespace-nowrap"
      },
      vertical: {
        root: "h-full flex-col",
        border: "h-full",
        container: "my-2"
      }
    },
    size: {
      xs: "",
      sm: "",
      md: "",
      lg: "",
      xl: ""
    },
    type: {
      solid: {
        border: "border-solid"
      },
      dashed: {
        border: "border-dashed"
      },
      dotted: {
        border: "border-dotted"
      }
    }
  },
  compoundVariants: [{
    orientation: "horizontal",
    size: "xs",
    class: { border: "border-t" }
  }, {
    orientation: "horizontal",
    size: "sm",
    class: { border: "border-t-[2px]" }
  }, {
    orientation: "horizontal",
    size: "md",
    class: { border: "border-t-[3px]" }
  }, {
    orientation: "horizontal",
    size: "lg",
    class: { border: "border-t-[4px]" }
  }, {
    orientation: "horizontal",
    size: "xl",
    class: { border: "border-t-[5px]" }
  }, {
    orientation: "vertical",
    size: "xs",
    class: { border: "border-s" }
  }, {
    orientation: "vertical",
    size: "sm",
    class: { border: "border-s-[2px]" }
  }, {
    orientation: "vertical",
    size: "md",
    class: { border: "border-s-[3px]" }
  }, {
    orientation: "vertical",
    size: "lg",
    class: { border: "border-s-[4px]" }
  }, {
    orientation: "vertical",
    size: "xl",
    class: { border: "border-s-[5px]" }
  }],
  defaultVariants: {
    color: "neutral",
    size: "xs",
    type: "solid"
  }
});

const skeleton = {
  base: "animate-pulse rounded-md bg-elevated"
};

const slideover = {
  slots: {
    overlay: "fixed inset-0 bg-elevated/75",
    content: "fixed bg-default divide-y divide-default sm:ring ring-default sm:shadow-lg flex flex-col focus:outline-none",
    header: "flex items-center gap-1.5 p-4 sm:px-6 min-h-16",
    wrapper: "",
    body: "flex-1 overflow-y-auto p-4 sm:p-6",
    footer: "flex items-center gap-1.5 p-4 sm:px-6",
    title: "text-highlighted font-semibold",
    description: "mt-1 text-muted text-sm",
    close: "absolute top-4 end-4"
  },
  variants: {
    side: {
      top: {
        content: "inset-x-0 top-0 max-h-full"
      },
      right: {
        content: "right-0 inset-y-0 w-full max-w-md"
      },
      bottom: {
        content: "inset-x-0 bottom-0 max-h-full"
      },
      left: {
        content: "left-0 inset-y-0 w-full max-w-md"
      }
    },
    transition: {
      true: {
        overlay: "data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_200ms_ease-in]"
      }
    }
  },
  compoundVariants: [{
    transition: true,
    side: "top",
    class: {
      content: "data-[state=open]:animate-[slide-in-from-top_200ms_ease-in-out] data-[state=closed]:animate-[slide-out-to-top_200ms_ease-in-out]"
    }
  }, {
    transition: true,
    side: "right",
    class: {
      content: "data-[state=open]:animate-[slide-in-from-right_200ms_ease-in-out] data-[state=closed]:animate-[slide-out-to-right_200ms_ease-in-out]"
    }
  }, {
    transition: true,
    side: "bottom",
    class: {
      content: "data-[state=open]:animate-[slide-in-from-bottom_200ms_ease-in-out] data-[state=closed]:animate-[slide-out-to-bottom_200ms_ease-in-out]"
    }
  }, {
    transition: true,
    side: "left",
    class: {
      content: "data-[state=open]:animate-[slide-in-from-left_200ms_ease-in-out] data-[state=closed]:animate-[slide-out-to-left_200ms_ease-in-out]"
    }
  }]
};

const slider = (options) => ({
  slots: {
    root: "relative flex items-center select-none touch-none",
    track: "relative bg-accented overflow-hidden rounded-full grow",
    range: "absolute rounded-full",
    thumb: "rounded-full bg-default ring-2 focus-visible:outline-2 focus-visible:outline-offset-2"
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, {
        range: `bg-${color}`,
        thumb: `ring-${color} focus-visible:outline-${color}/50`
      }])),
      neutral: {
        range: "bg-inverted",
        thumb: "ring-inverted focus-visible:outline-inverted/50"
      }
    },
    size: {
      xs: {
        thumb: "size-3"
      },
      sm: {
        thumb: "size-3.5"
      },
      md: {
        thumb: "size-4"
      },
      lg: {
        thumb: "size-4.5"
      },
      xl: {
        thumb: "size-5"
      }
    },
    orientation: {
      horizontal: {
        root: "w-full",
        range: "h-full"
      },
      vertical: {
        root: "flex-col h-full",
        range: "w-full"
      }
    },
    disabled: {
      true: {
        root: "opacity-75 cursor-not-allowed"
      }
    }
  },
  compoundVariants: [{
    orientation: "horizontal",
    size: "xs",
    class: {
      track: "h-[6px]"
    }
  }, {
    orientation: "horizontal",
    size: "sm",
    class: {
      track: "h-[7px]"
    }
  }, {
    orientation: "horizontal",
    size: "md",
    class: {
      track: "h-[8px]"
    }
  }, {
    orientation: "horizontal",
    size: "lg",
    class: {
      track: "h-[9px]"
    }
  }, {
    orientation: "horizontal",
    size: "xl",
    class: {
      track: "h-[10px]"
    }
  }, {
    orientation: "vertical",
    size: "xs",
    class: {
      track: "w-[6px]"
    }
  }, {
    orientation: "vertical",
    size: "sm",
    class: {
      track: "w-[7px]"
    }
  }, {
    orientation: "vertical",
    size: "md",
    class: {
      track: "w-[8px]"
    }
  }, {
    orientation: "vertical",
    size: "lg",
    class: {
      track: "w-[9px]"
    }
  }, {
    orientation: "vertical",
    size: "xl",
    class: {
      track: "w-[10px]"
    }
  }],
  defaultVariants: {
    size: "md",
    color: "primary"
  }
});

const stepper = (options) => ({
  slots: {
    root: "flex gap-4",
    header: "flex",
    item: "group text-center relative w-full",
    container: "relative",
    trigger: "rounded-full font-medium text-center align-middle flex items-center justify-center font-semibold group-data-[state=completed]:text-inverted group-data-[state=active]:text-inverted text-muted bg-elevated focus-visible:outline-2 focus-visible:outline-offset-2",
    indicator: "flex items-center justify-center size-full",
    icon: "shrink-0",
    separator: "absolute rounded-full group-data-[disabled]:opacity-75 bg-accented",
    wrapper: "",
    title: "font-medium text-default",
    description: "text-muted text-wrap",
    content: "size-full"
  },
  variants: {
    orientation: {
      horizontal: {
        root: "flex-col",
        container: "flex justify-center",
        separator: "top-[calc(50%-2px)] h-0.5",
        wrapper: "mt-1"
      },
      vertical: {
        header: "flex-col gap-4",
        item: "flex text-start",
        separator: "start-[calc(50%-1px)] -bottom-[10px] w-0.5"
      }
    },
    size: {
      xs: {
        trigger: "size-6 text-xs",
        icon: "size-3",
        title: "text-xs",
        description: "text-xs",
        wrapper: "mt-1.5"
      },
      sm: {
        trigger: "size-8 text-sm",
        icon: "size-4",
        title: "text-xs",
        description: "text-xs",
        wrapper: "mt-2"
      },
      md: {
        trigger: "size-10 text-base",
        icon: "size-5",
        title: "text-sm",
        description: "text-sm",
        wrapper: "mt-2.5"
      },
      lg: {
        trigger: "size-12 text-lg",
        icon: "size-6",
        title: "text-base",
        description: "text-base",
        wrapper: "mt-3"
      },
      xl: {
        trigger: "size-14 text-xl",
        icon: "size-7",
        title: "text-lg",
        description: "text-lg",
        wrapper: "mt-3.5"
      }
    },
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, {
        trigger: `group-data-[state=completed]:bg-${color} group-data-[state=active]:bg-${color} focus-visible:outline-${color}`,
        separator: `group-data-[state=completed]:bg-${color}`
      }])),
      neutral: {
        trigger: `group-data-[state=completed]:bg-inverted group-data-[state=active]:bg-inverted focus-visible:outline-inverted`,
        separator: `group-data-[state=completed]:bg-inverted`
      }
    }
  },
  compoundVariants: [{
    orientation: "horizontal",
    size: "xs",
    class: { separator: "start-[calc(50%+16px)] end-[calc(-50%+16px)]" }
  }, {
    orientation: "horizontal",
    size: "sm",
    class: { separator: "start-[calc(50%+20px)] end-[calc(-50%+20px)]" }
  }, {
    orientation: "horizontal",
    size: "md",
    class: { separator: "start-[calc(50%+28px)] end-[calc(-50%+28px)]" }
  }, {
    orientation: "horizontal",
    size: "lg",
    class: { separator: "start-[calc(50%+32px)] end-[calc(-50%+32px)]" }
  }, {
    orientation: "horizontal",
    size: "xl",
    class: { separator: "start-[calc(50%+36px)] end-[calc(-50%+36px)]" }
  }, {
    orientation: "vertical",
    size: "xs",
    class: { separator: "top-[30px]", item: "gap-1.5" }
  }, {
    orientation: "vertical",
    size: "sm",
    class: { separator: "top-[38px]", item: "gap-2" }
  }, {
    orientation: "vertical",
    size: "md",
    class: { separator: "top-[46px]", item: "gap-2.5" }
  }, {
    orientation: "vertical",
    size: "lg",
    class: { separator: "top-[54px]", item: "gap-3" }
  }, {
    orientation: "vertical",
    size: "xl",
    class: { separator: "top-[62px]", item: "gap-3.5" }
  }],
  defaultVariants: {
    size: "md",
    color: "primary"
  }
});

const _switch = (options) => ({
  slots: {
    root: "relative flex items-start",
    base: ["inline-flex items-center shrink-0 rounded-full border-2 border-transparent focus-visible:outline-2 focus-visible:outline-offset-2 data-[state=unchecked]:bg-accented", options.theme.transitions && "transition-[background] duration-200"],
    container: "flex items-center",
    thumb: "group pointer-events-none rounded-full bg-default shadow-lg ring-0 transition-transform duration-200 data-[state=unchecked]:translate-x-0 data-[state=unchecked]:rtl:-translate-x-0 flex items-center justify-center",
    icon: ["absolute shrink-0 group-data-[state=unchecked]:text-dimmed opacity-0 size-10/12", options.theme.transitions && "transition-[color,opacity] duration-200"],
    wrapper: "ms-2",
    label: "block font-medium text-default",
    description: "text-muted"
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, {
        base: `data-[state=checked]:bg-${color} focus-visible:outline-${color}`,
        icon: `group-data-[state=checked]:text-${color}`
      }])),
      neutral: {
        base: "data-[state=checked]:bg-inverted focus-visible:outline-inverted",
        icon: "group-data-[state=checked]:text-highlighted"
      }
    },
    size: {
      xs: {
        base: "w-7",
        container: "h-4",
        thumb: "size-3 data-[state=checked]:translate-x-3 data-[state=checked]:rtl:-translate-x-3",
        wrapper: "text-xs"
      },
      sm: {
        base: "w-8",
        container: "h-4",
        thumb: "size-3.5 data-[state=checked]:translate-x-3.5 data-[state=checked]:rtl:-translate-x-3.5",
        wrapper: "text-xs"
      },
      md: {
        base: "w-9",
        container: "h-5",
        thumb: "size-4 data-[state=checked]:translate-x-4 data-[state=checked]:rtl:-translate-x-4",
        wrapper: "text-sm"
      },
      lg: {
        base: "w-10",
        container: "h-5",
        thumb: "size-4.5 data-[state=checked]:translate-x-4.5 data-[state=checked]:rtl:-translate-x-4.5",
        wrapper: "text-sm"
      },
      xl: {
        base: "w-11",
        container: "h-6",
        thumb: "size-5 data-[state=checked]:translate-x-5 data-[state=checked]:rtl:-translate-x-5",
        wrapper: "text-base"
      }
    },
    checked: {
      true: {
        icon: "group-data-[state=checked]:opacity-100"
      }
    },
    unchecked: {
      true: {
        icon: "group-data-[state=unchecked]:opacity-100"
      }
    },
    loading: {
      true: {
        icon: "animate-spin"
      }
    },
    required: {
      true: {
        label: "after:content-['*'] after:ms-0.5 after:text-error"
      }
    },
    disabled: {
      true: {
        base: "cursor-not-allowed opacity-75",
        label: "cursor-not-allowed opacity-75",
        description: "cursor-not-allowed opacity-75"
      }
    }
  },
  defaultVariants: {
    color: "primary",
    size: "md"
  }
});

const table = (options) => ({
  slots: {
    root: "relative overflow-auto",
    base: "min-w-full overflow-clip",
    caption: "sr-only",
    thead: "relative",
    tbody: "divide-y divide-default [&>tr]:data-[selectable=true]:hover:bg-elevated/50 [&>tr]:data-[selectable=true]:focus-visible:outline-primary",
    tfoot: "relative",
    tr: "data-[selected=true]:bg-elevated/50",
    th: "px-4 py-3.5 text-sm text-highlighted text-left rtl:text-right font-semibold [&:has([role=checkbox])]:pe-0",
    td: "p-4 text-sm text-muted whitespace-nowrap [&:has([role=checkbox])]:pe-0",
    separator: "absolute z-[1] left-0 w-full h-px bg-(--ui-border-accented)",
    empty: "py-6 text-center text-sm text-muted",
    loading: "py-6 text-center"
  },
  variants: {
    pinned: {
      true: {
        th: "sticky bg-default/75 data-[pinned=left]:left-0 data-[pinned=right]:right-0",
        td: "sticky bg-default/75 data-[pinned=left]:left-0 data-[pinned=right]:right-0"
      }
    },
    sticky: {
      true: {
        thead: "sticky top-0 inset-x-0 bg-default/75 z-[1] backdrop-blur",
        tfoot: "sticky bottom-0 inset-x-0 bg-default/75 z-[1] backdrop-blur"
      },
      header: {
        thead: "sticky top-0 inset-x-0 bg-default/75 z-[1] backdrop-blur"
      },
      footer: {
        tfoot: "sticky bottom-0 inset-x-0 bg-default/75 z-[1] backdrop-blur"
      }
    },
    loading: {
      true: {
        thead: "after:absolute after:z-[1] after:h-px"
      }
    },
    loadingAnimation: {
      "carousel": "",
      "carousel-inverse": "",
      "swing": "",
      "elastic": ""
    },
    loadingColor: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, ""])),
      neutral: ""
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((loadingColor) => ({
    loading: true,
    loadingColor,
    class: {
      thead: `after:bg-${loadingColor}`
    }
  })), {
    loading: true,
    loadingColor: "neutral",
    class: {
      thead: "after:bg-inverted"
    }
  }, {
    loading: true,
    loadingAnimation: "carousel",
    class: {
      thead: "after:animate-[carousel_2s_ease-in-out_infinite] rtl:after:animate-[carousel-rtl_2s_ease-in-out_infinite]"
    }
  }, {
    loading: true,
    loadingAnimation: "carousel-inverse",
    class: {
      thead: "after:animate-[carousel-inverse_2s_ease-in-out_infinite] rtl:after:animate-[carousel-inverse-rtl_2s_ease-in-out_infinite]"
    }
  }, {
    loading: true,
    loadingAnimation: "swing",
    class: {
      thead: "after:animate-[swing_2s_ease-in-out_infinite]"
    }
  }, {
    loading: true,
    loadingAnimation: "elastic",
    class: {
      thead: "after:animate-[elastic_2s_ease-in-out_infinite]"
    }
  }],
  defaultVariants: {
    loadingColor: "primary",
    loadingAnimation: "carousel"
  }
});

const tabs = (options) => ({
  slots: {
    root: "flex items-center gap-2",
    list: "relative flex p-1 group",
    indicator: "absolute transition-[translate,width] duration-200",
    trigger: ["group relative inline-flex items-center min-w-0 data-[state=inactive]:text-muted hover:data-[state=inactive]:not-disabled:text-default font-medium rounded-md disabled:cursor-not-allowed disabled:opacity-75", options.theme.transitions && "transition-colors"],
    leadingIcon: "shrink-0",
    leadingAvatar: "shrink-0",
    leadingAvatarSize: "",
    label: "truncate",
    trailingBadge: "shrink-0",
    trailingBadgeSize: "sm",
    content: "focus:outline-none w-full"
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, ""])),
      neutral: ""
    },
    variant: {
      pill: {
        list: "bg-elevated rounded-lg",
        trigger: "grow",
        indicator: "rounded-md shadow-xs"
      },
      link: {
        list: "border-default",
        indicator: "rounded-full",
        trigger: "focus:outline-none"
      }
    },
    orientation: {
      horizontal: {
        root: "flex-col",
        list: "w-full",
        indicator: "left-0 w-(--reka-tabs-indicator-size) translate-x-(--reka-tabs-indicator-position)",
        trigger: "justify-center"
      },
      vertical: {
        list: "flex-col",
        indicator: "top-0 h-(--reka-tabs-indicator-size) translate-y-(--reka-tabs-indicator-position)"
      }
    },
    size: {
      xs: {
        trigger: "px-2 py-1 text-xs gap-1",
        leadingIcon: "size-4",
        leadingAvatarSize: "3xs"
      },
      sm: {
        trigger: "px-2.5 py-1.5 text-xs gap-1.5",
        leadingIcon: "size-4",
        leadingAvatarSize: "3xs"
      },
      md: {
        trigger: "px-3 py-1.5 text-sm gap-1.5",
        leadingIcon: "size-5",
        leadingAvatarSize: "2xs"
      },
      lg: {
        trigger: "px-3 py-2 text-sm gap-2",
        leadingIcon: "size-5",
        leadingAvatarSize: "2xs"
      },
      xl: {
        trigger: "px-3 py-2 text-base gap-2",
        leadingIcon: "size-6",
        leadingAvatarSize: "xs"
      }
    }
  },
  compoundVariants: [{
    orientation: "horizontal",
    variant: "pill",
    class: {
      indicator: "inset-y-1"
    }
  }, {
    orientation: "horizontal",
    variant: "link",
    class: {
      list: "border-b -mb-px",
      indicator: "-bottom-px h-px"
    }
  }, {
    orientation: "vertical",
    variant: "pill",
    class: {
      indicator: "inset-x-1",
      list: "items-center"
    }
  }, {
    orientation: "vertical",
    variant: "link",
    class: {
      list: "border-s -ms-px",
      indicator: "-start-px w-px"
    }
  }, ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "pill",
    class: {
      indicator: `bg-${color}`,
      trigger: `data-[state=active]:text-inverted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-${color}`
    }
  })), {
    color: "neutral",
    variant: "pill",
    class: {
      indicator: "bg-inverted",
      trigger: "data-[state=active]:text-inverted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverted"
    }
  }, ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "link",
    class: {
      indicator: `bg-${color}`,
      trigger: `data-[state=active]:text-${color} focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-${color}`
    }
  })), {
    color: "neutral",
    variant: "link",
    class: {
      indicator: "bg-inverted",
      trigger: "data-[state=active]:text-highlighted focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-inverted"
    }
  }],
  defaultVariants: {
    color: "primary",
    variant: "pill",
    size: "md"
  }
});

const textarea = (options) => {
  return defu({
    slots: {
      leading: "absolute start-0 flex items-start",
      trailing: "absolute end-0 flex items-start"
    },
    variants: {
      autoresize: {
        true: {
          base: "resize-none"
        }
      },
      size: {
        xs: {
          leading: "ps-2 inset-y-1",
          trailing: "pe-2 inset-y-1"
        },
        sm: {
          leading: "ps-2.5 inset-y-1.5",
          trailing: "pe-2.5 inset-y-1.5"
        },
        md: {
          leading: "ps-2.5 inset-y-1.5",
          trailing: "pe-2.5 inset-y-1.5"
        },
        lg: {
          leading: "ps-3 inset-y-2",
          trailing: "pe-3 inset-y-2"
        },
        xl: {
          leading: "ps-3 inset-y-2",
          trailing: "pe-3 inset-y-2"
        }
      }
    }
  }, input(options));
};

const timeline = (options) => ({
  slots: {
    root: "flex gap-1.5",
    item: "group relative flex flex-1 gap-3",
    container: "relative flex items-center gap-1.5",
    indicator: "group-data-[state=completed]:text-inverted group-data-[state=active]:text-inverted text-muted",
    separator: "flex-1 rounded-full bg-elevated",
    wrapper: "w-full",
    date: "text-dimmed text-xs/5",
    title: "font-medium text-highlighted text-sm",
    description: "text-muted text-wrap text-sm"
  },
  variants: {
    orientation: {
      horizontal: {
        root: "flex-row w-full",
        item: "flex-col",
        separator: "h-0.5"
      },
      vertical: {
        root: "flex-col",
        container: "flex-col",
        separator: "w-0.5"
      }
    },
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, {
        indicator: `group-data-[state=completed]:bg-${color} group-data-[state=active]:bg-${color}`
      }])),
      neutral: {
        indicator: "group-data-[state=completed]:bg-inverted group-data-[state=active]:bg-inverted"
      }
    },
    size: {
      "3xs": "",
      "2xs": "",
      "xs": "",
      "sm": "",
      "md": "",
      "lg": "",
      "xl": "",
      "2xl": "",
      "3xl": ""
    },
    reverse: {
      true: ""
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color) => ({
    color,
    reverse: false,
    class: {
      separator: `group-data-[state=completed]:bg-${color}`
    }
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    reverse: true,
    class: {
      separator: `group-data-[state=active]:bg-${color} group-data-[state=completed]:bg-${color}`
    }
  })), {
    color: "neutral",
    reverse: false,
    class: {
      separator: "group-data-[state=completed]:bg-inverted"
    }
  }, {
    color: "neutral",
    reverse: true,
    class: {
      separator: "group-data-[state=active]:bg-inverted group-data-[state=completed]:bg-inverted"
    }
  }, {
    orientation: "horizontal",
    size: "3xs",
    class: {
      wrapper: "pe-4.5"
    }
  }, {
    orientation: "horizontal",
    size: "2xs",
    class: {
      wrapper: "pe-5"
    }
  }, {
    orientation: "horizontal",
    size: "xs",
    class: {
      wrapper: "pe-5.5"
    }
  }, {
    orientation: "horizontal",
    size: "sm",
    class: {
      wrapper: "pe-6"
    }
  }, {
    orientation: "horizontal",
    size: "md",
    class: {
      wrapper: "pe-6.5"
    }
  }, {
    orientation: "horizontal",
    size: "lg",
    class: {
      wrapper: "pe-7"
    }
  }, {
    orientation: "horizontal",
    size: "xl",
    class: {
      wrapper: "pe-7.5"
    }
  }, {
    orientation: "horizontal",
    size: "2xl",
    class: {
      wrapper: "pe-8"
    }
  }, {
    orientation: "horizontal",
    size: "3xl",
    class: {
      wrapper: "pe-8.5"
    }
  }, {
    orientation: "vertical",
    size: "3xs",
    class: {
      wrapper: "-mt-0.5 pb-4.5"
    }
  }, {
    orientation: "vertical",
    size: "2xs",
    class: {
      wrapper: "pb-5"
    }
  }, {
    orientation: "vertical",
    size: "xs",
    class: {
      wrapper: "mt-0.5 pb-5.5"
    }
  }, {
    orientation: "vertical",
    size: "sm",
    class: {
      wrapper: "mt-1 pb-6"
    }
  }, {
    orientation: "vertical",
    size: "md",
    class: {
      wrapper: "mt-1.5 pb-6.5"
    }
  }, {
    orientation: "vertical",
    size: "lg",
    class: {
      wrapper: "mt-2 pb-7"
    }
  }, {
    orientation: "vertical",
    size: "xl",
    class: {
      wrapper: "mt-2.5 pb-7.5"
    }
  }, {
    orientation: "vertical",
    size: "2xl",
    class: {
      wrapper: "mt-3 pb-8"
    }
  }, {
    orientation: "vertical",
    size: "3xl",
    class: {
      wrapper: "mt-3.5 pb-8.5"
    }
  }],
  defaultVariants: {
    size: "md",
    color: "primary"
  }
});

const toast = (options) => ({
  slots: {
    root: "relative group overflow-hidden bg-default shadow-lg rounded-lg ring ring-default p-4 flex gap-2.5 focus:outline-none",
    wrapper: "w-0 flex-1 flex flex-col",
    title: "text-sm font-medium text-highlighted",
    description: "text-sm text-muted",
    icon: "shrink-0 size-5",
    avatar: "shrink-0",
    avatarSize: "2xl",
    actions: "flex gap-1.5 shrink-0",
    progress: "absolute inset-x-0 bottom-0",
    close: "p-0"
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, {
        root: `focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-${color}`,
        icon: `text-${color}`
      }])),
      neutral: {
        root: "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-inverted",
        icon: "text-highlighted"
      }
    },
    orientation: {
      horizontal: {
        root: "items-center",
        actions: "items-center"
      },
      vertical: {
        root: "items-start",
        actions: "items-start mt-2.5"
      }
    },
    title: {
      true: {
        description: "mt-1"
      }
    }
  },
  defaultVariants: {
    color: "primary"
  }
});

const toaster = {
  slots: {
    viewport: "fixed flex flex-col w-[calc(100%-2rem)] sm:w-96 z-[100] data-[expanded=true]:h-(--height) focus:outline-none",
    base: "pointer-events-auto absolute inset-x-0 z-(--index) transform-(--transform) data-[expanded=false]:data-[front=false]:h-(--front-height) data-[expanded=false]:data-[front=false]:*:opacity-0 data-[front=false]:*:transition-opacity data-[front=false]:*:duration-100 data-[state=closed]:animate-[toast-closed_200ms_ease-in-out] data-[state=closed]:data-[expanded=false]:data-[front=false]:animate-[toast-collapsed-closed_200ms_ease-in-out] data-[swipe=move]:transition-none transition-[transform,translate,height] duration-200 ease-out"
  },
  variants: {
    position: {
      "top-left": {
        viewport: "left-4"
      },
      "top-center": {
        viewport: "left-1/2 transform -translate-x-1/2"
      },
      "top-right": {
        viewport: "right-4"
      },
      "bottom-left": {
        viewport: "left-4"
      },
      "bottom-center": {
        viewport: "left-1/2 transform -translate-x-1/2"
      },
      "bottom-right": {
        viewport: "right-4"
      }
    },
    swipeDirection: {
      up: "data-[swipe=end]:animate-[toast-slide-up_200ms_ease-out]",
      right: "data-[swipe=end]:animate-[toast-slide-right_200ms_ease-out]",
      down: "data-[swipe=end]:animate-[toast-slide-down_200ms_ease-out]",
      left: "data-[swipe=end]:animate-[toast-slide-left_200ms_ease-out]"
    }
  },
  compoundVariants: [{
    position: ["top-left", "top-center", "top-right"],
    class: {
      viewport: "top-4",
      base: "top-0 data-[state=open]:animate-[slide-in-from-top_200ms_ease-in-out]"
    }
  }, {
    position: ["bottom-left", "bottom-center", "bottom-right"],
    class: {
      viewport: "bottom-4",
      base: "bottom-0 data-[state=open]:animate-[slide-in-from-bottom_200ms_ease-in-out]"
    }
  }, {
    swipeDirection: ["left", "right"],
    class: "data-[swipe=move]:translate-x-(--reka-toast-swipe-move-x) data-[swipe=end]:translate-x-(--reka-toast-swipe-end-x) data-[swipe=cancel]:translate-x-0"
  }, {
    swipeDirection: ["up", "down"],
    class: "data-[swipe=move]:translate-y-(--reka-toast-swipe-move-y) data-[swipe=end]:translate-y-(--reka-toast-swipe-end-y) data-[swipe=cancel]:translate-y-0"
  }],
  defaultVariants: {
    position: "bottom-right"
  }
};

const tooltip = {
  slots: {
    content: "flex items-center gap-1 bg-default text-highlighted shadow-sm rounded-sm ring ring-default h-6 px-2.5 py-1 text-xs select-none data-[state=delayed-open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] origin-(--reka-tooltip-content-transform-origin) pointer-events-auto",
    arrow: "fill-default",
    text: "truncate",
    kbds: `hidden lg:inline-flex items-center shrink-0 gap-0.5 not-first-of-type:before:content-['\xB7'] not-first-of-type:before:me-0.5`,
    kbdsSize: "sm"
  }
};

const tree = (options) => ({
  slots: {
    root: "relative isolate",
    item: "",
    listWithChildren: "ms-4.5 border-s border-default",
    itemWithChildren: "ps-1.5 -ms-px",
    link: "relative group w-full flex items-center text-sm before:absolute before:inset-y-px before:inset-x-0 before:z-[-1] before:rounded-md focus:outline-none focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-2",
    linkLeadingIcon: "shrink-0",
    linkLabel: "truncate",
    linkTrailing: "ms-auto inline-flex gap-1.5 items-center",
    linkTrailingIcon: "shrink-0 transform transition-transform duration-200 group-data-expanded:rotate-180"
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, {
        link: `focus-visible:before:ring-${color}`
      }])),
      neutral: {
        link: "focus-visible:before:ring-inverted"
      }
    },
    size: {
      xs: {
        link: "px-2 py-1 text-xs gap-1",
        linkLeadingIcon: "size-4",
        linkTrailingIcon: "size-4"
      },
      sm: {
        link: "px-2.5 py-1.5 text-xs gap-1.5",
        linkLeadingIcon: "size-4",
        linkTrailingIcon: "size-4"
      },
      md: {
        link: "px-2.5 py-1.5 text-sm gap-1.5",
        linkLeadingIcon: "size-5",
        linkTrailingIcon: "size-5"
      },
      lg: {
        link: "px-3 py-2 text-sm gap-2",
        linkLeadingIcon: "size-5",
        linkTrailingIcon: "size-5"
      },
      xl: {
        link: "px-3 py-2 text-base gap-2",
        linkLeadingIcon: "size-6",
        linkTrailingIcon: "size-6"
      }
    },
    selected: {
      true: {
        link: "before:bg-elevated"
      },
      false: {
        link: ["hover:not-disabled:text-highlighted hover:not-disabled:before:bg-elevated/50", options.theme.transitions && "transition-colors before:transition-colors"]
      }
    },
    disabled: {
      true: {
        link: "cursor-not-allowed opacity-75"
      }
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color) => ({
    color,
    selected: true,
    class: {
      link: `text-${color}`
    }
  })), {
    color: "neutral",
    selected: true,
    class: {
      link: "text-highlighted"
    }
  }],
  defaultVariants: {
    color: "primary",
    size: "md"
  }
});

const theme = {
  __proto__: null,
  accordion: accordion,
  alert: alert,
  avatar: avatar,
  avatarGroup: avatarGroup,
  badge: badge,
  breadcrumb: breadcrumb,
  button: button,
  buttonGroup: buttonGroup,
  calendar: calendar,
  card: card,
  carousel: carousel,
  checkbox: checkbox,
  checkboxGroup: checkboxGroup,
  chip: chip,
  collapsible: collapsible,
  colorPicker: colorPicker,
  commandPalette: commandPalette,
  container: container,
  contextMenu: contextMenu,
  drawer: drawer,
  dropdownMenu: dropdownMenu,
  fileUpload: fileUpload,
  form: form,
  formField: formField,
  input: input,
  inputMenu: inputMenu,
  inputNumber: inputNumber,
  inputTags: inputTags,
  kbd: kbd,
  link: link,
  modal: modal,
  navigationMenu: navigationMenu,
  pagination: pagination,
  pinInput: pinInput,
  popover: popover,
  progress: progress,
  radioGroup: radioGroup,
  select: select,
  selectMenu: selectMenu,
  separator: separator,
  skeleton: skeleton,
  slideover: slideover,
  slider: slider,
  stepper: stepper,
  switch: _switch,
  table: table,
  tabs: tabs,
  textarea: textarea,
  timeline: timeline,
  toast: toast,
  toaster: toaster,
  tooltip: tooltip,
  tree: tree
};

function getTemplates(options, uiConfig) {
  const templates = [];
  for (const component in theme) {
    templates.push({
      filename: `ui/${kebabCase(component)}.ts`,
      write: true,
      getContents: async () => {
        const template = theme[component];
        const result = typeof template === "function" ? template(options) : template;
        if (result?.defaultVariants?.color && options.theme?.defaultVariants?.color) {
          result.defaultVariants.color = options.theme.defaultVariants.color;
        }
        if (result?.defaultVariants?.size && options.theme?.defaultVariants?.size) {
          result.defaultVariants.size = options.theme.defaultVariants.size;
        }
        const variants = Object.entries(result.variants || {}).filter(([_, values]) => {
          const keys = Object.keys(values);
          return keys.some((key) => key !== "true" && key !== "false");
        }).map(([key]) => key);
        let json = JSON.stringify(result, null, 2);
        for (const variant of variants) {
          json = json.replace(new RegExp(`("${variant}": "[^"]+")`, "g"), `$1 as typeof ${variant}[number]`);
          json = json.replace(new RegExp(`("${variant}": \\[\\s*)((?:"[^"]+",?\\s*)+)(\\])`, "g"), (_, before, match, after) => {
            const replaced = match.replace(/("[^"]+")/g, `$1 as typeof ${variant}[number]`);
            return `${before}${replaced}${after}`;
          });
        }
        function generateVariantDeclarations(variants2) {
          return variants2.filter((variant) => json.includes(`as typeof ${variant}`)).map((variant) => {
            const keys = Object.keys(result.variants[variant]);
            return `const ${variant} = ${JSON.stringify(keys, null, 2)} as const`;
          });
        }
        return [
          ...generateVariantDeclarations(variants),
          `export default ${json}`
        ].join("\n\n");
      }
    });
  }
  templates.push({
    filename: "ui.css",
    write: true,
    getContents: () => `@source "./ui";

@theme static {
  --color-old-neutral-50: ${colors.neutral[50]};
  --color-old-neutral-100: ${colors.neutral[100]};
  --color-old-neutral-200: ${colors.neutral[200]};
  --color-old-neutral-300: ${colors.neutral[300]};
  --color-old-neutral-400: ${colors.neutral[400]};
  --color-old-neutral-500: ${colors.neutral[500]};
  --color-old-neutral-600: ${colors.neutral[600]};
  --color-old-neutral-700: ${colors.neutral[700]};
  --color-old-neutral-800: ${colors.neutral[800]};
  --color-old-neutral-900: ${colors.neutral[900]};
  --color-old-neutral-950: ${colors.neutral[950]};
}

@theme default inline {
  ${[...(options.theme?.colors || []).filter((color) => !colors[color]), "neutral"].map((color) => [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => `--color-${color}-${shade}: var(--ui-color-${color}-${shade});`).join("\n	")).join("\n	")}
  ${options.theme?.colors?.map((color) => `--color-${color}: var(--ui-${color});`).join("\n	")}
  --radius-xs: calc(var(--ui-radius) * 0.5);
  --radius-sm: var(--ui-radius);
  --radius-md: calc(var(--ui-radius) * 1.5);
  --radius-lg: calc(var(--ui-radius) * 2);
  --radius-xl: calc(var(--ui-radius) * 3);
  --radius-2xl: calc(var(--ui-radius) * 4);
  --radius-3xl: calc(var(--ui-radius) * 6);
  --text-color-dimmed: var(--ui-text-dimmed);
  --text-color-muted: var(--ui-text-muted);
  --text-color-toned: var(--ui-text-toned);
  --text-color-default: var(--ui-text);
  --text-color-highlighted: var(--ui-text-highlighted);
  --text-color-inverted: var(--ui-text-inverted);
  --background-color-default: var(--ui-bg);
  --background-color-muted: var(--ui-bg-muted);
  --background-color-elevated: var(--ui-bg-elevated);
  --background-color-accented: var(--ui-bg-accented);
  --background-color-inverted: var(--ui-bg-inverted);
  --background-color-border: var(--ui-border);
  --border-color-default: var(--ui-border);
  --border-color-muted: var(--ui-border-muted);
  --border-color-accented: var(--ui-border-accented);
  --border-color-inverted: var(--ui-border-inverted);
  --border-color-bg: var(--ui-bg);
  --ring-color-default: var(--ui-border);
  --ring-color-muted: var(--ui-border-muted);
  --ring-color-accented: var(--ui-border-accented);
  --ring-color-inverted: var(--ui-border-inverted);
  --ring-color-bg: var(--ui-bg);
  --ring-offset-color-default: var(--ui-border);
  --ring-offset-color-muted: var(--ui-border-muted);
  --ring-offset-color-accented: var(--ui-border-accented);
  --ring-offset-color-inverted: var(--ui-border-inverted);
  --ring-offset-color-bg: var(--ui-bg);
  --divide-color-default: var(--ui-border);
  --divide-color-muted: var(--ui-border-muted);
  --divide-color-accented: var(--ui-border-accented);
  --divide-color-inverted: var(--ui-border-inverted);
  --divide-color-bg: var(--ui-bg);
  --outline-color-default: var(--ui-border);
  --outline-color-inverted: var(--ui-border-inverted);
  --stroke-default: var(--ui-border);
  --stroke-inverted: var(--ui-border-inverted);
  --fill-default: var(--ui-border);
  --fill-inverted: var(--ui-border-inverted);
}
`
  });
  templates.push({
    filename: "ui/index.ts",
    write: true,
    getContents: () => Object.keys(theme).map((component) => `export { default as ${component} } from './${kebabCase(component)}'`).join("\n")
  });
  templates.push({
    filename: "types/ui.d.ts",
    getContents: () => `import * as ui from '#build/ui'
import type { TVConfig } from '@nuxt/ui'
import type { defaultConfig } from 'tailwind-variants'
import colors from 'tailwindcss/colors'

const icons = ${JSON.stringify(uiConfig.icons)};

type NeutralColor = 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone'
type Color = Exclude<keyof typeof colors, 'inherit' | 'current' | 'transparent' | 'black' | 'white' | NeutralColor> | (string & {})

type AppConfigUI = {
  colors?: {
    ${options.theme?.colors?.map((color) => `'${color}'?: Color`).join("\n		")}
    neutral?: NeutralColor | (string & {})
  }
  icons?: Partial<typeof icons>
  tv?: typeof defaultConfig
} & TVConfig<typeof ui>

declare module '@nuxt/schema' {
  interface AppConfigInput {
    /**
     * Nuxt UI theme configuration
     * @see https://ui.nuxt.com/getting-started/theme#customize-theme
     */
    ui?: AppConfigUI
  }
}

export {}
`
  });
  templates.push({
    filename: "ui-image-component.ts",
    write: true,
    getContents: ({ app }) => {
      const image = app?.components?.find((c) => c.pascalName === "NuxtImg" && !/nuxt(?:-nightly)?\/dist\/app/.test(c.filePath));
      return image ? genExport(image.filePath, [{ name: image.export, as: "default" }]) : 'export default "img"';
    }
  });
  return templates;
}
function addTemplates(options, nuxt, resolve) {
  const templates = getTemplates(options, nuxt.options.appConfig.ui);
  for (const template of templates) {
    if (template.filename.endsWith(".d.ts")) {
      addTypeTemplate(template);
    } else {
      addTemplate(template);
    }
  }
  nuxt.hook("prepare:types", ({ references }) => {
    references.push({ path: resolve("./runtime/types/app.config.d.ts") });
  });
}

export { getDefaultUiConfig as a, addTemplates as b, defaultOptions as d, getTemplates as g, resolveColors as r };
