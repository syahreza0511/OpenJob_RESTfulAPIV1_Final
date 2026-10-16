const errorHandler = (err, req, res, next) => {


    // log error untuk debugging server
    console.error(err.message);



    // default status code
    const statusCode = err.statusCode || 500;

    // Tentukan status string berdasarkan jenis error
    const status = statusCode >= 400 && statusCode < 500 ? 'failed' : 'error';


    res.status(statusCode).json({

        status: status,

        message: err.message || 'Internal Server Error'

    });


};


module.exports = errorHandler;