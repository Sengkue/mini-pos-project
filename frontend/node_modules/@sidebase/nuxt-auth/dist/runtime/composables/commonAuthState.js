import { computed } from "vue";
import { useState } from "#imports";
export function makeCommonAuthState() {
  const data = useState("auth:data", () => void 0);
  const hasInitialSession = computed(() => !!data.value);
  const lastRefreshedAt = useState("auth:lastRefreshedAt", () => {
    if (hasInitialSession.value) {
      return /* @__PURE__ */ new Date();
    }
    return void 0;
  });
  const loading = useState("auth:loading", () => false);
  const status = computed(() => {
    if (loading.value) {
      return "loading";
    }
    if (data.value) {
      return "authenticated";
    }
    return "unauthenticated";
  });
  return {
    data,
    loading,
    lastRefreshedAt,
    status
  };
}
