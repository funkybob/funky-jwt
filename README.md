Native JWT validation
=====================

Using nothing but what modern browsers provide, this package can decode and
validate JWT, even those signed using RS256.

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
 - keys: known JWK objects.
 - alg : specify to restrict acceptable algorithm.
 - aud : specify to validate the audience claim.

