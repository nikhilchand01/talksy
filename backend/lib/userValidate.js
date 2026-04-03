import yup from 'yup';

export const userScehma= yup.object({
    fullName: yup
    .string()
    .trim()
    .min(3, 'Username must be atleast of 3 character')
    .required(),
    email: yup
    .string()
    .required(),
    password: yup
    .string()
    .min(4, 'Password must be atleast 4 character')
    .required()
})
export const validateUser = (schema) => async(req, res, next) =>{
    try{
        await schema.validate(req.body)
        next()
    }catch(error){
        return res.status(400).json({
            errors:error.errors
        })
    }
}