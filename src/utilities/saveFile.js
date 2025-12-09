// Progressive save utility for web: prefers File System Access API (Chromium)
// Fallbacks to classic Blob download when not available or when permission denied.

/**
 * Save a file, letting the user choose directory/filename when supported.
 * @param {string|Blob|Uint8Array} contents - Data to write
 * @param {string} suggestedName - Suggested filename, e.g., "my_map.json"
 * @param {string} mimeType - MIME type, e.g., "application/json"
 * @returns {Promise<boolean>} true if saved, false if cancelled or failed
 */
export async function saveFile(contents, suggestedName = 'file.txt', mimeType = 'application/octet-stream') {
  try {
    // Prefer native file picker if available (Chromium: Edge/Chrome/Opera/Brave)
    const hasPicker = typeof window !== 'undefined' && typeof window.showSaveFilePicker === 'function';
    if (hasPicker) {
      const opts = {
        suggestedName,
        types: [
          {
            description: 'File',
            accept: { [mimeType || 'application/octet-stream']: [`.${(suggestedName.split('.').pop() || 'dat')}`] }
          }
        ]
      };
      let handle;
      try {
        handle = await window.showSaveFilePicker(opts);
      } catch (e) {
        // User cancelled the dialog
        if (e && (e.name === 'AbortError' || e.name === 'NotAllowedError')) return false;
        throw e;
      }

      const writable = await handle.createWritable();
      const blob = contents instanceof Blob ? contents : new Blob([contents], { type: mimeType });
      await writable.write(blob);
      await writable.close();
      return true;
    }
  } catch (e) {
    // fall through to fallback
    try { console.warn('Native save picker failed, using download fallback:', e); } catch {}
  }

  // Fallback: trigger a download to the browser default location
  try {
    const blob = contents instanceof Blob ? contents : new Blob([contents], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = suggestedName || 'file.dat';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(link.href), 0);
    return true;
  } catch (e) {
    try { console.error('Download fallback failed:', e); } catch {}
    return false;
  }
}

export default saveFile;
