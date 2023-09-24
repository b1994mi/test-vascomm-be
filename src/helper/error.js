function errNotFound(req, res, next) {
    res.status(404).json({
        code: res.statusCode,
        message: "Sorry can't find that!"
    })
}

function errInternalSvr(err, req, res, next) {
    console.log(err.stack)

    res.status(500).send({
        code: res.statusCode,
        message: 'Ooops, internal server error, my bad',
    })
}

module.exports = {
    errNotFound,
    errInternalSvr,
}
