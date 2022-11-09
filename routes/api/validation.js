const Joi = require('joi')

const schemaContact = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required()
});

const schemaId = Joi.object({
    contactId: Joi.string().required()
});


const validate = async (schema, obj, res, next) => {
    try {
        await schema.validateAsync(obj)
        next()
    }
    catch (err) { 
        console.log(err)  
        res.status(400).json({status: 'error', code: 400, message: err.message })
    }
}

module.exports.validateContact = async (req, res, next) => {
    return await validate(schemaContact, req.body, res, next)
}

module.exports.validateId = async (req, res, next) => {
    return await validate(schemaId, req.params, res, next)
}