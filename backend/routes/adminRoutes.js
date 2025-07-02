const express = require('express')
const adminRouter = express.Router()
const upload = require('../middleware/multer')
const {authAdmin} = require('../middleware/authMiddleware')
const {getAllCustomer,getAllHost,getAllVehicles,getAllReviews,getAllPayments,deleteUserProfile, getAdminOverview, getUserStats, getVehicleStats, getVehicleApprovalStats, approveVehicle, deleteVehicle} = require('../controllers/adminController')
const {AddVehicle,updateVehicle,getVehicle,getVehiclebyOwner} = require('../controllers/vehicleController')
const { getBookingById , getAllBookings, updateBookingStatus, deleteBooking, getBookingByVehicleId} = require('../controllers/bookingController')
const { checkUser, getReviewByVehicle } = require('../controllers/customerController')


adminRouter.get('/check-Admin',authAdmin, checkUser )

adminRouter.delete('/delete/:id',authAdmin,deleteUserProfile) //delete profile
adminRouter.get('/getAllCustomers',authAdmin,getAllCustomer) //get all customers
adminRouter.get('/getAllHosts',authAdmin,getAllHost) //get all hosts

adminRouter.get('/getAllBookings',authAdmin,getAllBookings) //get all bookings
adminRouter.get('/getBooking/:id',authAdmin,getBookingById) //get booking by id
adminRouter.patch('/updateBookingStatus/:id',authAdmin,updateBookingStatus) //update booking by id
adminRouter.delete('/deleteBooking/:id',authAdmin,deleteBooking) //delete booking by id
adminRouter.get('/bookingByVehicle/:id',authAdmin,getBookingByVehicleId) //get all bookings


adminRouter.get('/getAllReviews',authAdmin,getAllReviews) //get all reviews
adminRouter.get('/getReviewByVehicle/:vehicleId',authAdmin,getReviewByVehicle)

adminRouter.get('/getAllPayments',authAdmin,getAllPayments) //get all payments

adminRouter.get('/getAllVehicles',authAdmin,getAllVehicles) //get all vehicles
adminRouter.get('/getVehicle/:id', authAdmin , getVehicle)
adminRouter.post('/addVehicleAdmin',authAdmin,upload.array('images'), AddVehicle) //add vehicle
adminRouter.patch('/updateVehicle/:id',authAdmin,upload.array('images'), updateVehicle) //update vehicle  
adminRouter.delete('/deleteVehicle/:id',authAdmin,deleteVehicle) //delete vehicle
adminRouter.get('/getVehicle/:id',authAdmin,getVehicle) //get vehicle
adminRouter.get('/getVehiclebyOwner/:userid',authAdmin,getVehiclebyOwner) //get vehicle by user
adminRouter.patch('/approveVehicle/:id',authAdmin,approveVehicle)

// statistics

adminRouter.get('/overview',authAdmin,getAdminOverview)
adminRouter.get('/user-stats',authAdmin,getUserStats)
adminRouter.get('/vehicle-stats',authAdmin,getVehicleStats)
adminRouter.get('/vehicle-approval-stats', authAdmin, getVehicleApprovalStats);

module.exports = adminRouter