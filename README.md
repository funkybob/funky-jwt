Native JWT validation
=====================

Using nothing but what modern browsers provide, this package can decode and
validate JWT, even those signed using RS256.

Supported Algorithms
--------------------

 - HS256
 - HS384
 - HS512
 - RS256
 - RS384
 - RS512

Verified Claims
---------------

 - aud
 - iss
 - exp
 - nbf

Note: RS algorithms only support keys in JWK format, currently.

Usage
-----

    import {JWT} from "@funkybob/jwt/verify.js"

    let jwt = new JWT(token, options);
    let valid;
    try {
        valid = await jwt.isValid()
    } catch(err) {
        valid = false;
    };


Options
-------

 - secret : Base64Url encoded secret for HS algorithms.
 - keys: known JWK objects for RS algorithms.
 - alg : specify to restrict acceptable algorithm.
 - aud : specify to validate the audience claim.
 - iss : specify to only accept tokens from this issuer.

Properties
----------

 - token: the original token value
 - parts: the token split by '.'
 - header: the decoded header fields
 - message: the decoded message fields
 - signature: the raw signature

Loading Keys
------------

If you are using the RS family of signing algorithms, you will need to provide
a map of kid to JWK objects (see https://tools.ietf.org/html/rfc7517).

If your issuer provides their JWK at well known URI ("/.well-known/jwks.json")
you can use the "fetchKeys" function to retrieve them once. This returns a
Promise:

    options.keys = await fetchKeys('hostname.myissuer.com')

or

    fetchKeys('hostname').then(keys => options.keys = keys);

Remember to not try to validate a token before this promise is resolved.

Errors
------

"Unsupported algorithm"

The 'alg' specified in the Header does not match that specified in options, or
is not supported by this library.

"Unknown key"

The 'kid' specified in the Header could not be found in the list of known keys.
If options.hostname was specified, the list of keys retrieved did not contain
the matching kid.

"Invalid signature"

The signing algorithm returned a negative result.

"Unrecognised issuer"

The 'iss' field in the Message did not match that specified in options.

"Invalid audience"

The 'aud' specified in options was not found in the 'aud' list in the Message.

"Token has expired"

The tokens 'exp' claim is in the past.

"Token not yet valid"

The tokens 'nbf' claim is in the future.


Modules
=======

crypto
------

# function importKey (alg, key)

Imports the key matter as appropriate for the specified algorithm.

keys
----

# fetchKeys (hostname)

util
----

# function b64d (v)

base64url decode 'v'

# function b64e (v)

base64url encode 'v'

# function str2bytes (v)

Converts 'v' from a String to a Uint8Array.

# function bytes2str (v)

Converts 'v' from a Uint8Array to a String

# class verifier({ alg, iss, aud })

Construct a token verifier.

## async setSecret(secret)

Sets the secret for this verifier.

## async setKeys(keys)

Sets the map of (kid -> JWK) for this verifier.

## decode(token)

Decodes a JWT string into an Object:

 - header : the JSON decoded content of the header part of the token.
 - claims : the JSON decoded content of the claims part of the token.
 - signature : the signature from the token
 - parts : the token split by '.'
 - token : the original token string

## async isValid(jwt)

Check if a jwt is valid.

 - verifies header.typ is 'JWT'
 - verifies the algorithm matches what we accept.
 - verifies the signature matches
 - if an "iss" is specified on the verifier, verify it matches.
 - if an "aud" is specified on the verifier, verify it matches.
 - if the token claims an "exp", ensure it's after now.
 - if the token claims a "nbf", ensure it's before now.


verify
------

# class JWT(token, options)

Options:

 - secret : Base64Url encoded secret for HS algorithms.
 - keys: known JWK objects for RS algorithms.
 - alg : specify to restrict acceptable algorithm.
 - aud : specify to validate the audience claim.
 - iss : specify to only accept tokens from this issuer.


# async isValid ()