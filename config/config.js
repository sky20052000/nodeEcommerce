require("dotenv").config();

module.exports = {
    PORT : process.env.port,
    HOST:process.env.host,
    MONGO_URL:process.env.mongo_url,
    JWT_SECRET_KEY : process.env.jwt_secret_key, 
    COOKIE_EXPIRES: process.env.expires_cookie,
    SMPT_HOST: process.env.smpt_host,
    SMPT_PORT: process.env.smpt_port,
    SMPT_SERVICE: process.env.smpt_service,
    SMPT_MAIL: process.env.smpt_mail,
    SMPT_PASSWORD: process.env.smptPassowrd,

}