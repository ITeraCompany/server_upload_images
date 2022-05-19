const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const Keys = require('../config/keys')
const {User} = require('../models/Model')



var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = Keys.jwt;

module.exports = passport => {
    try {
        passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
            const user = await User.findOne({
                    where: {id: jwt_payload.userId}
                }
            );
            if (user) {
                return done(null, user);
            } else {
                return done(null, false)
            }
        }));
    }catch (e) {
       console.log(e)
    }
}


