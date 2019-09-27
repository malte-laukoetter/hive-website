declare module "vuetify/lib" {
  import "vuetify/types/lib";
  import { DirectiveOptions } from "vue";

  const ClickOutside: DirectiveOptions;
  const Ripple: DirectiveOptions;
  const Resize: DirectiveOptions;
  const Scroll: DirectiveOptions;
  const Touch: DirectiveOptions;

  export { ClickOutside, Ripple, Resize, Scroll, Touch };
}

declare module "vuetify/lib/directives" {}
