const {
    body
} = require('express-validator')

exports.validate = (method) => {
    switch (method) {
        case 'create_admin': {
            return [
                body('User email', 'Invalid email').exists().isEmail(),
                body('User name', 'Invalid Full name').isLength({
                    min: 3
                }).withMessage('Name must be of 3 characters long.'),
                body('User role', 'Invalid User Role Id').isNumeric(),
                body('User status', 'Invalid User status').isNumeric(),
            ]
        }
        case 'update_admin': {
            return [
                body('au_email', 'Invalid email').exists().isEmail(),
                body('au_name', 'Invalid Full name').isLength({
                    min: 3
                }).withMessage('Name must be of 3 characters long.'),
                body('ar_role_id', 'Invalid User Role Id').isNumeric(),
                body('au_active_status', 'Invalid User status').isNumeric()
            ]
        }
		case 'create_camp': {
            return [
                body('Brand ID', 'Invalid Brand').isNumeric(),
                body('Campaign Name', 'Invalid Campaign name').isLength({
                    min: 3
                }).withMessage('Campaign Name must be of 3 characters long.'),
                body('Completion Time', 'Invalid Completion Time').isNumeric(),
            ]
        }
		case 'create_task': {
            return [
                body('Campaign id', 'Invalid Campaign').isNumeric(),
                body('Task name', 'Invalid Task name').isLength({
                    min: 3
                }).withMessage('Task Name must be of 3 characters long.'),
                body('Task type', 'Invalid Task type').isNumeric()
            ]
        }
    }
}