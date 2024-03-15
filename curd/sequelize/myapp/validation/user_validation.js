
exports.validation_user = (data) => {
    if (!req.body.first_name || !req.body.last_name || !req.body.email_id  || !req.body.address.address1 || !req.body.address.address2 || !req.body.address.city || !req.body.address.state || !req.body.address.country) {
        EndResult(res,400,{"message": "missing the requirements"})
        return false;
    }
    else{
        return true;
    }
}