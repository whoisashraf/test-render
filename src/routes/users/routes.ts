import express from 'express';
import { 
    createAdminUserHandler,
    // addAddressHandler,
    createUserHandler, 
    createVendorUserHandler, 
    deleteUserHandler, 
    // deleteAddressHandler, 
    getSingleUser, 
    // getUserddressHandler, 
    getUsersHandler, 
    resetPasswordHandler, 
    resetUserPasswordHandler, 
    // updateAddressHandler, 
    updateUserHandler, 
    updateUserVendorHandler, 
    verifyTokenHandler,
} from '../../controller/user.controller';
import requiresUser from "../../middleware/validation/requiresUser";
import {
    userValidationRules,
    sessionValidationRules,
    validate,
    userUpdateValidationRules,
    addAddressValidationRules,
    userVendorUpdateValidationRules
} from '../../middleware/validation/validator'
import {
    createUserSessionHandler,
    getAllUserSessionsHandler,
    getUserSessionsHandler,
    invalidateUserSessionHandler
} from '../../controller/session.controller';
import requiresAdmin from '../../middleware/validation/requireAdmin';

const UserRouter = express.Router();

UserRouter.get('/verifyToken/:id/:token',  verifyTokenHandler)
UserRouter.post('/reset/password',  resetPasswordHandler)
UserRouter.post('/passwordreset/:id/:token',  resetUserPasswordHandler)

// create user / admins
UserRouter.post('/create', userValidationRules(), validate, createUserHandler)
UserRouter.post('/createadmin', userValidationRules(), validate, createAdminUserHandler)
UserRouter.post('/vendor-create', userValidationRules(), validate, createVendorUserHandler)
UserRouter.post('/update', userUpdateValidationRules(), validate, requiresUser, updateUserHandler)
UserRouter.post('/vendorupdate', userVendorUpdateValidationRules(), validate, requiresUser, updateUserVendorHandler)


//User session routes (login, logout, refresh session)
// UserRouter.get('/all', getAllUserSessionsHandler)
UserRouter.post('/sessions', sessionValidationRules(), validate, createUserSessionHandler)
UserRouter.delete('/sessions', requiresUser, invalidateUserSessionHandler)
UserRouter.get('/sessions', requiresUser, getUserSessionsHandler )

//admin routes
UserRouter.get('/admin/all-users', requiresAdmin, getUsersHandler)
UserRouter.get('/admin/:userId', requiresAdmin, getSingleUser)


//you can also login with the login route
UserRouter.post('/login', sessionValidationRules(), validate, createUserSessionHandler)
UserRouter.delete('/logout', requiresUser, invalidateUserSessionHandler)
UserRouter.delete('/delete/:id', requiresAdmin, deleteUserHandler)


//addresses routes
// UserRouter.post('/address/add', addAddressValidationRules(), validate, requiresUser, addAddressHandler)
// UserRouter.delete('/address/delete/:id', requiresUser, deleteAddressHandler)
// UserRouter.get('/address/get', requiresUser, getUserddressHandler)
// UserRouter.post('/updateaddress', requiresUser, updateAddressHandler)

export default UserRouter;
