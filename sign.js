import { algoParams } from "./crypto.js"
import { b64e } from "./util.js"

let encoder = new TextEncoder('utf-8');

export function signJwt(header, body, options) {
    let msg = encoder.encode(JSON.stringify(body))
    let msg = b64e(msg)
    if (!header.typ) {
        header.typ = 'JWT'
    }
    if (algoParams[header.alg] === undefined) {
        throw new Error("Unsupported algorithm")
    }

}