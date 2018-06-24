/* TODO : Comply with sequence in https://tools.ietf.org/html/rfc7519#section-7.2 */
import { b64d, str2bytes } from "./util.js"
import { algoParams, import_key } from "./crypto.js"

let encoder = new TextEncoder('utf-8');

const defaultOptions = {
    alg: 'RS256',
    keys: {}
}

export class JWT {

    constructor (token, options) {
        this.token = token;
        this.options = Object.assign({}, defaultOptions, options);

        this.parts = token.split('.');
        let [header, message, signature] = this.parts.map(b64d);
        this.header = JSON.parse(header);
        this.message = JSON.parse(message);
        this.signature = signature
    }

    async is_valid () {
        if (this.header.typ !== 'JWT') throw new Error("Not a JWT!");
        // TODO: Support a list of acceptable algs?
        if (this.options.alg && this.header.alg !== this.options.alg) throw new Error("Unsupported algorithm");

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
            throw new Error("Unknown algorithm");
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
        let jwk = this.options.keys[kid];
        if (jwk === undefined) return Promise.reject('Unknown key');
        let key = await import_key(jwk.alg, jwk)
        return crypto.subtle.verify(algoParams[this.header.alg], key, str2bytes(this.signature), encoder.encode(content));
    }

    async verify_hmac (content) {
        let key = await import_key(this.options.alg, encoder.encode(this.options.secret))
        return crypto.subtle.verify(algoParams[this.header.alg], key, str2bytes(this.signature), encoder.encode(content));
    }
}
