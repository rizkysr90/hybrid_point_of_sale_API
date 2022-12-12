const success = (statusCode,data,message) => {
    return {
        metadata : {
            status: statusCode,
            msg : message,
        },
        data
    }
}

const errors = (error_code,data,message) => {
    let errorResponse = new Error(message);
    errorResponse.error_code = error_code;
    errorResponse.data = data;

    throw errorResponse;
}


module.exports = {
    success,
    errors
}