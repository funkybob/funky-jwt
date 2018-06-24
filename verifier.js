
import { b64d, str2bytes } from "./util.js"
import { algoParams, import_key } from "./crypto.js"

let encoder = new TextEncoder('utf-8');

class verifier {
    constructor({ alg, iss, aud }) {
        this.alg = alg || 'RS256'
        this.iss = iss
        this.aud = aud
        this.keys = {}
        this.secrect = undefined
    }

    async setSecret(secret) {
        this.secret = await import_key(this.alg, encoder.encode(secret))
    }

    async setKeys(keys) {
        for (let kid in keys) {
            this.keys[kid] = await import_key(this.alg, keys[kid])
        }
    }

    decode(token) {
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

    async is_valid(jwt) {
        if (jwt.header.typ !== 'JWT') return "Not a JWT"
        if (this.alg && jwt.header.alg !== this.alg) return "Unsupported algorithm"

        let key, content = jwt.parts.splice(0, 2).join('.');
        switch (this.alg) {
            case 'HS256':
            case 'HS384':
            case 'HS512':
                key = this.secret
                break
            case 'RS256':
            case 'RS384':
            case 'RS512':
                key = this.keys[jwt.header.kid]
                if (key === undefined) return 'Unknown kid'
                break
            default:
                return "Unknown algorithm"
        }
        let valid = await crypto.subtle.verify(algoParams[this.alg], key, str2bytes(jwt.signature), encoder.encode(content))
        if (!valid) return "Invalid signature"

        if (this.iss && this.iss !== jwt.claims.iss)
            return "Unrecognised issuer"

        if (this.aud) {
            if (Array.isArray(jwt.claims.aud)) {
                if (!jwt.claims.aud.includes(this.aud))
                    return "Invalid audience"
            } else {
                if (this.aud !== jwt.claims.aud)
                    return "Invalid audience"
            }
        }

        let now = Math.floor(new Date().getTime() / 1000);
        if (jwt.claims.exp && jwt.claims.exp < now)
            return "Token has expired"

        if (jwt.claims.nbf && jwt.claims.nbf > now)
            return "Token not yet valid"

        return true
    }
}

export async function makeVerifier({ alg, iss, aud, secret, keys }) {
    const ver = new verifier({alg, iss, aud})
    if (secret) await ver.setSecret(secret);
    if (keys) await ver.setKeys(keys);
    return ver
}