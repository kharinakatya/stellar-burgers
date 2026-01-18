export function setCookie(
  name: string,
  value: string,
  props: Record<string, any> = {}
) {
  props = { path: '/', ...props };
  let expires = props.expires;
  if (typeof expires === 'number') {
    const d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = d.toUTCString();
    props.expires = expires;
  }

  let updatedCookie =
    encodeURIComponent(name) + '=' + encodeURIComponent(value);

  for (const propName in props) {
    updatedCookie += '; ' + propName;
    const propValue = props[propName];
    if (propValue !== true) {
      updatedCookie += '=' + propValue;
    }
  }

  if (typeof document !== 'undefined') {
    document.cookie = updatedCookie;
  }
}

export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\/+^])/g, '\\$1') + '=([^;]*)'
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function deleteCookie(name: string) {
  setCookie(name, '', { path: '/', expires: -1 });
}
