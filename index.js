/* TODO : Comply with sequence in https://tools.ietf.org/html/rfc7519#section-7.2 */

// Base64Url decode
function b64d (v) {
    switch(v.length % 4) {
        case 3: v = v + '='; break;
        case 2: v = v + '=='; break;
        case 1: throw Error('Invalid string length!')
    }
    return atob(v.replace(/-/g, '+').replace(/_/g, '/'))
}

function b64e (v) {
    return btoa(v).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// String to ArrayBuffer
function bytes (v) {
        let buff = new Uint8Array(new ArrayBuffer(v.length));
        buff.set(Array.from(v).map(x => x.charCodeAt(0)))
        return buff;
}

let encoder = new TextEncoder('utf-8');

const defaultOptions = {
    alg: 'RS256',
    keys: {}
}

const algoParams = {
    'HS256': {name: 'HMAC', hash: 'SHA-256'},
    'HS384': {name: 'HMAC', hash: 'SHA-384'},
    'HS512': {name: 'HMAC', hash: 'SHA-512'},
    'RS256': {name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256'},
    'RS384': {name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-384'},
    'RS512': {name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-512'}
}

async function fetchKeys (hostname) {
    let resp = await fetch(`https://${hostname}/.well-known/jwks.json`)
        .then(resp => resp.json())

    return resp.keys.reduce((acc, val) => {acc[val.kid] = val; return acc;}, {});
}


class JWT {

    constructor (token, options) {
        this.token = token;
        this.options = {...defaultOptions, ...options};

        this.parts = token.split('.');
        let [header, message, signature] = this.parts.map(b64d);
        this.header = JSON.parse(header);
        this.message = JSON.parse(message);
        this.signature = signature
    }

    async is_valid () {
        if (this.header.typ !== 'JWT') throw new Error("Not a JWT!");
        // TODO: Support a list of acceptable algs?
        if (this.header.alg && this.header.alg !== this.options.alg) throw new Error("Unsupported algorithm");

        let content = this.parts.splice(0, 2).join('.');
        let valid;
        switch(this.header.alg) {
        case 'RS256':
        case 'RS384':
        case 'RS512':
            valid = await this.verify_rsa(content);
            break;
        case 'HS256':
        case 'HS384':
        case 'HS512':
            valid = await this.verify_hmac(content);
            break;
        default:
            throw new Error("Unsupported algorithm");
        }
        if (!valid) throw new Error("Invalid signature");

        if (this.options.iss && this.options.iss !== this.message.iss)
            throw new Error("Unrecognised issuer")

        if (this.options.aud) {
            if (Array.isArray(this.message.aud)) {
                if (!this.message.aud.includes(this.options.aud))
                    throw new Error("Invalid audience");
            } else {
                if (this.options.aud !== this.message.aud)
                    throw new Error("Invalid audience");
            }
        }

        let now = Math.floor(new Date().getTime() / 1000);
        if (this.message.exp && this.message.exp < now)
            throw new Error("Token has expired");

        if (this.message.nbf && this.message.nbf > now)
            throw new Error("Token not yet valid");

        return true;
    }

    async verify_rsa (content) {
        let key = await this.get_rs_key(this.header.kid)
        return crypto.subtle.verify(algoParams[this.header.alg], key, bytes(this.signature), encoder.encode(content));
    }

    get_rs_key (kid) {
        let jwk = this.options.keys[kid];
        if (jwk === undefined) return Promise.reject('Unknown key');
        return crypto.subtle.importKey('jwk', jwk, algoParams[jwk.alg], false, ['verify']);
    }

    async verify_hmac (content) {
        let key = await this.get_hmac_key(this.options.secret)
        return crypto.subtle.verify(algoParams[this.header.alg], key, bytes(this.signature), encoder.encode(content));
    }

    get_hmac_key (secret) {
        return crypto.subtle.importKey('raw', encoder.encode(b64d(secret)), algoParams[this.header.alg], false, ['verify']);
    }
}

export {
    JWT,
    fetchKeys
}
