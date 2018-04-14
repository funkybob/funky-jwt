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

Note: RS algorithms only support keys in JWK format, currently.

Usage
-----

    let jwt = new JWT(token, options);
    try {
        jwt.is_valid()
    } catch {
        // :(
    };


Options
-------

 - hostname : used to retrieve public JWK from well known URI.
 - secret : Base64Url encoded secret for HS algorithms.
 - keys: known JWK objects for RS algorithms.
 - alg : specify to restrict acceptable algorithm.
 - aud : specify to validate the audience claim.

