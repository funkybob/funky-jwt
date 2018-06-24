// Base64Url decode
export function b64d (v) {
    switch(v.length % 4) {
        case 3: v = v + '='; break;
        case 2: v = v + '=='; break;
        case 1: throw Error('Invalid string length!')
    }
    return atob(v.replace(/-/g, '+').replace(/_/g, '/'))
}

export function b64e (v) {
    return btoa(v).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// String to ArrayBuffer
export function str2bytes (v) {
    return Uint8Array.from(v.split('').map(x => x.charCodeAt(0)))
}

export function bytes2str (v) {
    return v.map(x => String.fromCharCode(x)).join('')
}