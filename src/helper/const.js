const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const ROLE_ADMIN = 1
const ROLE_USER = 2

module.exports = {
    EMAIL_REGEX,
    ROLE_ADMIN,
    ROLE_USER,
}
