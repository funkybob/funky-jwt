
/*
 * The atob/btoa functions implement base64url, which uses '-' and '_' in place
 * of '+' and '/'.
 *
 * JWT wants standard base64, so these functions correct for this difference.
 *
 * See RFC 4648
 */

/**
 * @desc Decodes a string using base64(url)
 *
 * Appends = padding if necessary.
 *
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
 *
 * @param {String} v
 * @return {String}
 */
export function b64e (v) {
   return btoa(v).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * @desc Convert a String to an array of bytes
 *
 * This is different to TextEncoder as we're receiving the signature as
 * bytes-as-a-string, not a valid unicode codepoint sequence.
 *
 * @param {String} v
 * @return {Uint8Array}
 */
export function str2bytes (v) {
   return Uint8Array.from(v.split(''), x => x.charCodeAt(0))
}

/**
 * @desc Convert an array of bytes to a String
 *
 * @param {Uint8Array} v
 * @return {String}
 */
export function bytes2str (v) {
   return Array.from(v, x => String.fromCharCode(x)).join('')
}
