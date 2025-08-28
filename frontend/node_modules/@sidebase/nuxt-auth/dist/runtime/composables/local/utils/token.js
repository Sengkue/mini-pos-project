export function formatToken(token, config) {
  if (token === null || token === void 0) {
    return null;
  }
  return config.token.type.length > 0 ? `${config.token.type} ${token}` : token;
}
