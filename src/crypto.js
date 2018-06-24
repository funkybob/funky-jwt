export const algoParams = {
    'HS256': {name: 'HMAC', hash: 'SHA-256', length: 256},
    'HS384': {name: 'HMAC', hash: 'SHA-384', length: 384},
    'HS512': {name: 'HMAC', hash: 'SHA-512', length: 512},
    'RS256': {name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256'},
    'RS384': {name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-384'},
    'RS512': {name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-512'}
}

/**
 * @desc Load key matter as a CryptoKey object, suitable for the supplied algorithm.
 * @param {String} alg - JWT Algorithm type.
 * @param {String|Object} key - Key matter
 * @returns {CryptoKey}
 */
export function importKey (alg, key) {
    let keyFmt = (alg.slice(0, 2) === 'HS') ? 'raw' : 'jwk'
    return crypto.subtle.importKey(keyFmt, key, algoParams[alg], false, ['verify']);
}
