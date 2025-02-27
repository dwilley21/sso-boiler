/**
 * Cookie module shim that provides the necessary exports
 * This fixes the "does not provide an export named 'parse'" error
 */

// Simple cookie parser implementation
export function parse(str) {
  const obj = {};
  if (typeof str !== 'string' || !str.trim()) return obj;
  
  str.split(/; */).forEach(pair => {
    const idx = pair.indexOf('=');
    if (idx < 0) return;
    
    const key = pair.substr(0, idx).trim();
    let val = pair.substr(idx + 1).trim();
    
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1);
    }
    
    if (obj[key] === undefined) {
      try {
        obj[key] = decodeURIComponent(val);
      } catch (e) {
        obj[key] = val;
      }
    }
  });
  
  return obj;
}

// Simple cookie serializer implementation
export function serialize(name, value, options = {}) {
  const encodedValue = encodeURIComponent(value);
  let cookieString = `${name}=${encodedValue}`;
  
  if (options.maxAge) {
    cookieString += `; Max-Age=${options.maxAge}`;
  }
  
  if (options.domain) {
    cookieString += `; Domain=${options.domain}`;
  }
  
  if (options.path) {
    cookieString += `; Path=${options.path}`;
  }
  
  if (options.expires) {
    cookieString += `; Expires=${options.expires.toUTCString()}`;
  }
  
  if (options.httpOnly) {
    cookieString += '; HttpOnly';
  }
  
  if (options.secure) {
    cookieString += '; Secure';
  }
  
  if (options.sameSite) {
    cookieString += `; SameSite=${options.sameSite}`;
  }
  
  return cookieString;
}

// Default export for CommonJS compatibility
export default {
  parse,
  serialize
};

// Also expose as global variables for direct access
if (typeof window !== 'undefined') {
  window.cookieParse = parse;
  window.cookieSerialize = serialize;
  window.cookie = { parse, serialize };
}

console.log('Cookie shim loaded successfully'); 