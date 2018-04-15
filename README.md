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

Supported Claims
----------------

 - aud
 - iss
 - exp
 - nbf

Note: RS algorithms only support keys in JWK format, currently.

Usage
-----

    let jwt = new JWT(token, options);
    let valid;
    try {
        valid = await jwt.is_valid()
    } catch(err) {
    	valid = false;
    };


Options
-------

 - hostname : used to retrieve public JWK from well known URI.
 - secret : Base64Url encoded secret for HS algorithms.
 - keys: known JWK objects for RS algorithms.
 - alg : specify to restrict acceptable algorithm.
 - aud : specify to validate the audience claim.
 - iss : specify to only accept tokens from this issuer.

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
