
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
