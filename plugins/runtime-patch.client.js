/**
 * Runtime patch to fix the "parse is not a function" error
 * This plugin runs early in the application lifecycle
 */

export default defineNuxtPlugin(() => {
  // Only run in the browser
  if (typeof window === 'undefined') return;
  
  console.log('Applying runtime patch for cookie functions');
  
  // Define a global parse function that will be used by cookies.js
  window.parse = function(str) {
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
  };
  
  // Create a MutationObserver to watch for script additions
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeName === 'SCRIPT' && node.src && node.src.includes('cookies.js')) {
            console.log('Detected cookies.js script loading:', node.src);
            
            // Apply our patch after a short delay to ensure the script is executed
            setTimeout(() => {
              console.log('Applying patch to cookies.js functions');
              
              // Patch the problematic functions
              if (typeof window.noHintGetAll === 'function') {
                const originalNoHintGetAll = window.noHintGetAll;
                window.noHintGetAll = function(cookieString) {
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
                console.log('Patched noHintGetAll function');
              }
              
              if (typeof window.getAll === 'function') {
                const originalGetAll = window.getAll;
                window.getAll = function(cookieString, hint) {
                  try {
                    return window.noHintGetAll(cookieString);
                  } catch (error) {
                    console.warn('Error in patched getAll:', error);
                    return {};
                  }
                };
                console.log('Patched getAll function');
              }
              
              if (typeof window.getItem === 'function') {
                const originalGetItem = window.getItem;
                window.getItem = function(sKey, hint) {
                  try {
                    if (!sKey) return null;
                    const cookies = window.getAll(undefined, hint);
                    return cookies[sKey] || null;
                  } catch (error) {
                    console.warn('Error in patched getItem:', error);
                    return null;
                  }
                };
                console.log('Patched getItem function');
              }
            }, 100);
          }
        });
      }
    });
  });
  
  // Start observing the document
  observer.observe(document, { childList: true, subtree: true });
  
  // Also try to patch any existing scripts
  document.querySelectorAll('script').forEach(script => {
    if (script.src && script.src.includes('cookies.js')) {
      console.log('Found existing cookies.js script:', script.src);
      // Apply our patch
      setTimeout(() => {
        if (typeof window.noHintGetAll === 'function') {
          window.noHintGetAll = function(cookieString) {
            if (!cookieString) {
              cookieString = document.cookie || '';
            }
            return window.parse(cookieString);
          };
          console.log('Patched existing noHintGetAll function');
        }
      }, 100);
    }
  });
  
  console.log('Runtime patch initialized');
}); 