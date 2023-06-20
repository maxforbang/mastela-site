export function getUrlParams(url: string) {
  const regex = /[?&]([^=#]+)=([^&#]*)/g;
  const params: Record<string, string> = {};
  let match;

  while ((match = regex.exec(url))) {
    const key = decodeURIComponent(match[1] ?? '');
    const value = decodeURIComponent(match[2] ?? '');
    params[key] = value;
  }

  return params;
}