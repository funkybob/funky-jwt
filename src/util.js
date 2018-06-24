/**
 * @desc Decodes a string using base64(url)
 * @param {String} v
 * @return {String}
*/
export function b64d (v) {
    switch(v.length % 4) {
        case 3: v = v + '='; break;
        case 2: v = v + '=='; break;
        case 1: throw Error('Invalid string length!')
    }
    return atob(v.replace(/-/g, '+').replace(/_/g, '/'))
}

/**
 * @desc Encodes a string using base64(url)
 * @param {String} v
 * @return {String}
 */
export function b64e (v) {
   return btoa(v).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * @desc Convert a String to an array of bytes
 * @param {String} v
 * @return {Uint8Array}
 */
export function str2bytes (v) {
   return Uint8Array.from(v.split('').map(x => x.charCodeAt(0)))
}

/**
 * @desc Convert an array of bytes to a String
 * @param {Uint8Array} v
 * @return {String}
 */
export function bytes2str (v) {
   return v.map(x => String.fromCharCode(x)).join('')
}