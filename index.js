/*
TODO : Comply with sequence in https://tools.ietf.org/html/rfc7519#section-7.2
*/

// Base64Url decode
let b64d = (v) => {
	switch(v.length % 4) {
		case 3: v = v + '='; break;
		case 2: v = v + '=='; break;
		case 1: throw Error('Invalid string length!')
	}
	return atob(v.replace(/-/g, '+').replace(/_/g, '/'))
}

// String to ArrayBuffer
let s2b = (v) => {
	let buff = new Uint8Array(new ArrayBuffer(v.length));
	buff.set(Array.from(v).map(x => x.charCodeAt(0)))
	return buff;
}

const defaultOptions = {
	alg: 'RS256',
	keys: {}
}

const algoParams = {
	'RS256': {name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256'}
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

	is_valid () {
		if (this.header.typ !== 'JWT') throw new Error("Not a JWT!");
		if (this.header.alg !== this.options.alg) throw new Error("Unsupported algorithm");

		let content = this.parts.splice(0, 2).join('.');
		let valid;
		switch(this.header.alg) {
		case 'RS256':
			valid = this.verify_rs256(content);
			break;
		default:
			throw new Error("Unsupported algorithm");
		}
		if (!valid) throw new Error("Invalid signature");

		if (this.options.aud && this.options.aud !== this.message.aud)
			throw new Error("Invalid audience");

		let now = Math.floor(new Date().getTime() / 1000);
		if (this.message.exp && this.message.exp < now)
			throw new Error("Token has expired");

		if (this.message.iat && this.message.iat > now)
			throw new Error("Issue in future");

		return true;
	}

	async verify_rs256 (content) {
		let key = await this.get_key(this.header.kid);

		return crypto.subtle.verify(algoParams['RS256'], key, s2b(this.signature), s2b(content));
	}

	async get_key (kid) {
		if (this.options.keys[kid] === undefined) {
			let resp = await fetch(`https://${this.options.hostname}/.well-known/jwks.json`)
				.then(resp => resp.json())
			resp.keys.forEach(k => this.options.keys[k.kid] = k);
		}

		let jwk = this.options.keys[kid];
		return crypto.subtle.importKey('jwk', jwk, algoParams[jwk.alg], false, ['verify']);
	}

}
