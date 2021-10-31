const { body, validationResult } = require('express-validator');

function userValidation() {
    return async (req, res, next) => {
        if(req.body.firstName||req.body.firstName==''){
            await body('firstName').trim().isLength({ min: 3 }).withMessage('FirstName should be at least 3 characters!')
            .isAlpha().withMessage('FirstName should consist only English letters!').run(req);

        }

        if(req.body.lastName||req.body.lastName==''){
            await body('lastName').trim().isLength({ min: 5 }).withMessage('LastName should be at least 5 characters!')
            .isAlpha().withMessage('LastName should consist only English letters!').run(req);
        }
        
        await body('email').trim().isEmail().withMessage('Email is invalid!').toLowerCase().run(req);
        
        await body('password').trim().isLength({ min: 4 }).withMessage('Password should be at least 4 characters!').run(req);

        if (req.body.repass || req.body.repass == '') {
            await body('repass').trim().custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw 'Passwords do not match!';
                }
                return true;
            }).run(req);
        }

        const errors = validationResult(req).errors;
        if (errors.length > 0) {
            req.userErrors = {
                name: 'inputError',
                message: errors.map(x => x.msg)
            }
        }
        next();
    };
};

function postValidation() {
    return async (req, res, next) => {
        await body('title').trim().isLength({ min: 6 }).withMessage('Title should be at least 6 characters!').run(req);
        await body('keyword').trim().isLength({ min: 6 }).withMessage('Keyword should be at least 6 characters!').run(req);
        await body('location').trim().isLength({ max:10 }).withMessage('Location should be max 10 characters!').run(req);
        await body('date').trim().isLength({min:10, max:10 }).withMessage('Date should be exactly 10 characters!').run(req);
        await body('imageUrl').isURL().withMessage('Play image url is invalid!').run(req);
        await body('description').isLength({ min: 8 }).withMessage('Description should be at least 8 characters!').run(req);

        const errors = validationResult(req).errors;
        if (errors.length > 0) {
            req.postErrors = {
                name: 'inputError',
                message: errors.map(x => x.msg)
            }
        }
        next();
    };
};


module.exports = {
    userValidation,
    postValidation
}