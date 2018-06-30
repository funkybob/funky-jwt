/**
 * @desc Fetch JWK key matter from a well-known URL.
 * @see https://tools.ietf.org/html/rfc7517
 * @param {String} hostname
 * @returns {Promise<Object>}
 */
export function fetchKeys (hostname) {
    return fetch(`https://${hostname}/.well-known/jwks.json`)
        .then(resp => resp.json())
        .then(data => {
            return data.keys.reduce((acc, val) => {
                acc[val.kid] = val;
                return acc;
            }, {})
        })
}
