
/**
 * @desc Decodes a string using base64(url)
 * @param {string} v
 * @return {string}
 */
export function b64d (v : string) : string {
    switch(v.length % 4) {
        case 3: v = v + '='; break;
        case 2: v = v + '=='; break;
        case 1: throw Error('Invalid string length!')
    }
    return atob(v.replace(/-/g, '+').replace(/_/g, '/'))
}

/**
 * @desc Encodes a string using base64(url)
 * @param {string} v
 * @return {string}
 */
export function b64e (v : string) : string {
   return btoa(v).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * @desc Convert a String to an array of bytes
 * @param {string} v
 * @return {Uint8Array}
 */
export function str2bytes (v : string) : Uint8Array {
   return Uint8Array.from(v.split('').map(x => x.charCodeAt(0)))
}

/**
 * @desc Convert an array of bytes to a String
 * @param {Uint8Array} v
 * @return {string}
 */
export function bytes2str (v : Uint8Array) : string {
   return Array.from(v).map((x) => String.fromCharCode(x)).join('')
}
