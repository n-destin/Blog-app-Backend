const globalErrorHandler = (err, req, res, next)=>{
    const status = err.status? err.status: "failed"
    const message = err.message
    const stack  = err.stack
    const statusCode = err.statusCode? err.statusCode : 500
    // send the error 
    res.send({
        // something: "User exists",
        status, message, stack, statusCode
    })
}

module.exports = globalErrorHandler