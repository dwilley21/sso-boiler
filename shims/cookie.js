// This is a shim for the cookie module to fix the export issue
import * as cookieModule from 'cookie'

// Re-export all the functions from the cookie module
export const parse = cookieModule.parse
export const serialize = cookieModule.serialize

// Also export as default for CommonJS compatibility
export default cookieModule 