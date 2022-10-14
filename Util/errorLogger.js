const fs = require('fs');
const errorLogger = async(err, req, res, next)=>{
    try{
        await fs.appendFile('ErrorLogger.txt', `${new Date().toDateString()} - ${req.method} - ${req.path} - ${err.message}\n`,(error)=>{
            if(error){
                console.log("Logging failed");
            }
        });
        if(err.status){
            res.status(err.status);
        } else {
            res.status(500);
        }
        res.json({
            message:err.message
        })
    } catch (exception){
        res.status(500).json({
            message:exception
        });
    }
}

module.exports = errorLogger;