const jwt = require("express-jwt")
const jwks = require("jwks-rsa")

const validate = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev-mei12s29.us.auth0.com/.well-known/jwks.json'
    }),
    aud: 'http://localhost:5000',
    issuer: 'https://dev-mei12s29.us.auth0.com/',
    algorithms: ['RS256']
})

const validateUser = () => {
    return [
        validate,
        function (err, req, res, next) {
            if (err.name === 'UnauthorizedError') {
                res.status(err.status).send({ message: err.message, code: err.code })
                return
            }
            next()
        }
    ]
}

module.exports = validateUser
