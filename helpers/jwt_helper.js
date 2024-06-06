const JWT = require('jsonwebtoken');
const createError = require('http-errors');


module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload ={}
            const secret = 'ACCESS_TOKEN_SECRET'
            const options = {
                expiresIn: '5min',
            }

            JWT.sign(payload, secret, options,(err,token) => {
                if(err) {
                reject(createError.InternalServerError())
                return
                }
                resolve(token)
            })
        })
    },
    verifyAccessToken : (req, res, next) => {
        if(!req.headers['authorization']) return next(createError.Unauthorized())
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ')
        const token = bearerToken[1]
        console.log(token);
        JWT.verify('ACCESS_TOKEN_SECRET',(err,payload)=>{
            if(err){
                const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
                return next(createError.Unauthorized(message))
            }
            req.payload = payload 
            next()
        })
    },

    signRefreshToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload ={}
            const secret = 'REFRESH_TOKEN_SECRET'
            const options = {
                expiresIn: '1y',
                audience: userId,
            }
            JWT.sign(payload, secret, options,(err,token) => {
                if(err){
                    reject(createError.InternalServerError())
                }
                resolve(token)   
            })
        })
    },
    verifyRefreshToken :(refreshToken) =>{
        return new Promise((resolve, reject) =>{
            JWT.verify(refreshToken,'REFRESH_TOKEN_SECRET',(err,payload)=>{
                if(err) return reject(createError.Unauthorized())
                const userId = payload.aud
                resolve(userId)
            })
        })
    }

}