
exports.validation_create_user = (data) => {
    if (!data.first_name || !data.last_name || !data.email_id  || !data.address.address1 || !data.address.address2 || !data.address.city || !data.address.state || !data.address.country) {
        return false;
    }
    else{
        return true;
    }
}


exports.validation_user = (data) => {
    if (!data.first_name && !data.last_name && !data.email_id  && !data.address.address1 && !data.address.address2 && !data.address.city && !data.address.state && !data.address.country) {
        return false;
    }
    else{
        return true;
    }
}