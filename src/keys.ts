interface FetchedJsonWebKey extends JsonWebKey {
    kid?: string;
}

export interface KeyMap {
    [key: string]: FetchedJsonWebKey;
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
            return data.keys.reduce((acc : KeyMap, val : FetchedJsonWebKey) => {
                (val.kid) && (acc[val.kid] = val);
                return acc;
            }, {})
        })
}
