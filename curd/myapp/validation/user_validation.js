
exports.validation_user = (data) => {
    if (!data.first_name || !data.last_name || !data.email_id  || !data.address.address1 || !data.address.address2 || !data.address.city || !data.address.state || !data.address.country) {
        EndResult(res,400,{"message": "missing the requirements"})
        return false;
    }
    else{
        return true;
    }
}


exports.validation_create_user = (data) => {
    if (!data.first_name && !data.last_name && !data.email_id  && !data.address.address1 && !data.address.address2 && !data.address.city && !data.address.state && !data.address.country) {
        EndResult(res,400,{"message": "missing the requirements"})
        return false;
    }
    else{
        return true;
    }
}