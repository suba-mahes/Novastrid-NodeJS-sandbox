
exports.validation_create_user = (data) => {
    if (!data.first_name || !data.last_name || !data.email_id || !data.address ) {
        return false;
    }
    else{
        for(const address of data.address){
            if(!address.address_name || !address.address1 || !address.address2 || !address.city || !address.state || !address.country){
                return false;
            }
        }
        return true;
    }
}


exports.validation_user = (data) => {
    if (!data.first_name && !data.last_name && !data.email_id &&!data.address ) {
        return false;
    }
    else{
        for(const address of data.address){
            if(!address.address_name && !address.address1 && !address.address2 && !address.city && !address.state && !address.country){
                return false;
            }
        }
        return true;
    }
}
