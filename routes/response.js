class WebResp{
 static sResp(resData,msg) {
        return {
            success: true,
            message: msg,
            data: resData,
        };
    }

 static eResp(msg) {
        return {
            success: false,
            message: msg,
            
        };
    }
}

module.exports=WebResp;