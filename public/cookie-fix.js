/**
 * Direct fix for the "parse is not a function" error in cookies.js
 * This script is loaded directly in the HTML before any other JavaScript
 */

(function() {
  console.log('Cookie fix script starting');
  
  // Only define parse if it doesn't already exist
  if (typeof window.parse !== 'function') {
    console.log('Defining global parse function');
    window.parse = function(str) {
      const obj = {};
      if (typeof str !== 'string' || !str.trim()) return obj;
      
      str.split(/; */).forEach(function(pair) {
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
    };
  }
  
  // Only override Object.defineProperty if we haven't already
  if (!window.__cookieFixApplied) {
    console.log('Setting up property definition interceptor');
    window.__cookieFixApplied = true;
    
    const originalDefineProperty = Object.defineProperty;
    Object.defineProperty = function(obj, prop, descriptor) {
      // Check if we're defining one of the problematic functions
      if (obj === window && (prop === 'noHintGetAll' || prop === 'getAll' || prop === 'getItem')) {
        console.log('Intercepting definition of', prop);
        
        // Modify the descriptor to use our implementation
        if (descriptor.value && typeof descriptor.value === 'function') {
          const originalFn = descriptor.value;
          
          if (prop === 'noHintGetAll') {
            descriptor.value = function(cookieString) {
              try {
                if (!cookieString) {
                  cookieString = document.cookie || '';
                }
                return window.parse(cookieString);
              } catch (error) {
                console.warn('Error in patched noHintGetAll:', error);
                return {};
              }
            };
          } else if (prop === 'getAll') {
            descriptor.value = function(cookieString, hint) {
              try {
                return window.noHintGetAll ? window.noHintGetAll(cookieString) : window.parse(cookieString || document.cookie);
              } catch (error) {
                console.warn('Error in patched getAll:', error);
                return {};
              }
            };
          } else if (prop === 'getItem') {
            descriptor.value = function(sKey, hint) {
              try {
                if (!sKey) return null;
                const cookies = window.getAll ? window.getAll(undefined, hint) : window.parse(document.cookie);
                return cookies[sKey] || null;
              } catch (error) {
                console.warn('Error in patched getItem:', error);
                return null;
              }
            };
          }
        }
      }
      
      // Skip if property is already defined and not configurable
      try {
        // Call the original defineProperty
        return originalDefineProperty.call(this, obj, prop, descriptor);
      } catch (error) {
        // If we get an error about redefining a property, log it but don't crash
        if (error instanceof TypeError && error.message.includes('redefine property')) {
          console.warn('Cannot redefine property:', prop, error.message);
          return obj;
        }
        throw error;
      }
    };
  }
  
  console.log('Cookie fix script loaded');
})(); 