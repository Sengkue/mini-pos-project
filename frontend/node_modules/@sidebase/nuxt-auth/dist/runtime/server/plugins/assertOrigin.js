import { ERROR_MESSAGES } from "../services/errors.js";
import { isProduction, useTypedBackendConfig } from "../../helpers.js";
import { getServerBaseUrl } from "../services/authjs/utils.js";
import { useRuntimeConfig } from "#imports";
function defineNitroPlugin(def) {
  return def;
}
export default defineNitroPlugin(() => {
  try {
    const runtimeConfig = useRuntimeConfig();
    const trustHostUserPreference = useTypedBackendConfig(runtimeConfig, "authjs").trustHost;
    getServerBaseUrl(runtimeConfig, false, trustHostUserPreference, isProduction);
  } catch (error) {
    if (!isProduction) {
      console.info(ERROR_MESSAGES.NO_ORIGIN);
    } else {
      throw error;
    }
  }
});
