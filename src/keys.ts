/* Override this until https://github.com/Microsoft/TypeScript/issues/26854 is fixed. */
interface JsonWebKey {
    alg?: string;
    crv?: string;
    d?: string;
    dp?: string;
    dq?: string;
    e?: string;
    ext?: boolean;
    k?: string;
    key_ops?: string[];
    kid?: string;
    kty?: string;
    n?: string;
    // oth?: RsaOtherPrimesInfo[];
    p?: string;
    q?: string;
    qi?: string;
    use?: string;
    x?: string;
    y?: string;
}

export interface KeyMap {
    [key: string]: JsonWebKey;
}

/**
 * @desc Fetch JWK key matter from a well-known URL.
 * @see https://tools.ietf.org/html/rfc7517
 * @param {string} hostname
 * @returns {Promise<Object>}
 */
export function fetchKeys (hostname : string) {
    return fetch(`https://${hostname}/.well-known/jwks.json`)
        .then(resp => resp.json())
        .then(data => {
            return data.keys.reduce((acc : KeyMap, val : JsonWebKey) => {
                (val.kid) && (acc[val.kid] = val);
                return acc;
            }, {})
        })
}
