
import { b64d, str2bytes } from "./util.js"
import { algoParams, importKey } from "./crypto.js"

/**
 * @desc Parse and decode a JWT
 * @param {String} token
 * @returns {Object} jwt
 */
export function decode(token) {
    let parts = token.split('.')
    let [header, claims, signature] = parts.map(b64d);
    return {
        header: JSON.parse(header),
        claims: JSON.parse(claims),
        signature,
        token,
        parts
    }
}

/**
 * @param {Object} jwt - Token as decoded by decode
 * @param {Object} config
 * @param {String} config.alg - Allowed algorithm for signature
 * @param {String} [config.iss] - Issuer
 * @param {String} [config.aud] - Audience
 * @param {String} [config.secret] - Secret, for HS* algorithms
 * @param {Object} [config.keys] - Keys, for RS* algorithms
 * @returns {Boolean}
 * @throws {Error}
 */
export async function verify(jwt, { alg, iss, aud, secret, keys }) {
    if (jwt.header.typ !== 'JWT') throw new Error("Not a JWT")
    if (jwt.header.alg !== alg) throw new Error("Unsupported algorithm")

    let encoder = new TextEncoder();
    let key
    let content = jwt.parts.splice(0, 2).join('.');
    switch (alg) {
        case 'HS256':
        case 'HS384':
        case 'HS512':
            key = await importKey(alg, encoder.encode(secret))
            break
        case 'RS256':
        case 'RS384':
        case 'RS512':
            key = keys[jwt.header.kid]
            if (key === undefined) throw new Error('Unknown kid')
            key = await importKey(alg, key)
            break
        default:
            throw new Error("Unknown algorithm")
    }
    let valid = await crypto.subtle.verify(algoParams[alg], key, str2bytes(jwt.signature), encoder.encode(content))
    if (!valid) throw new Error("Invalid signature")

    if (iss && iss !== jwt.claims.iss)
        throw new Error("Unrecognised issuer")

    if (aud) {
        if (Array.isArray(jwt.claims.aud)) {
            if (!jwt.claims.aud.includes(aud))
                throw new Error("Invalid audience")
        } else {
            if (aud !== jwt.claims.aud)
                throw new Error("Invalid audience")
        }
    }

    let now = Math.floor(new Date().getTime() / 1000);
    if (jwt.claims.exp && jwt.claims.exp < now)
        throw new Error("Token has expired")

    if (jwt.claims.nbf && jwt.claims.nbf > now)
        throw new Error("Token not yet valid")

    return true
}
