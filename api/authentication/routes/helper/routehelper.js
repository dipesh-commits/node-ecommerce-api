const Joi = require('joi');

module.exports = {
  validateBody: (schema) => {

    return (req, res, next) => {
      const result = Joi.validate(req.body, schema);

      if (result.error) {
          console.log(result.error);
          res.json({status:"error",error:result.error.details[0].message});
      }

      if (!req.value) { req.value = {}; }
      req.value['body'] = result.value;
      next();
    }
  },


  schemas: {
    authSchema: Joi.object().keys({
      email: Joi.string().required(),
      fullname: Joi.string().required(),
      password: Joi.string().required(),
      //phone:Joi.number(),
      address:Joi.string().required(),
       location:Joi.array().items(Joi.number(),Joi.number()),
       age:Joi.string().required(),

        gender:Joi.string().required(),
    }),
    authSchema1: Joi.object().keys({
      shopname:Joi.string().required(),
      email: Joi.string().email().required(),
      fullname: Joi.string().required(),
      password: Joi.string().required(),
      //phone:Joi.number(),
      address:Joi.string().required(),
       location:Joi.array().items(Joi.number(),Joi.number()),

    }),
    sec: Joi.object().keys({
         secretToken:Joi.string().required(),
   }),
   sec2: Joi.object().keys({
        email:Joi.string().required(),
  }),
  }
}
