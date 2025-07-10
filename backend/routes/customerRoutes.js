const express = require('express')
const customerRouter = express.Router()
const {register,login,checkUser, profile,logout,updateProfile,addReview,getAllReviews, deleteMyReview,UpdatePassword, getReviewByVehicle, getMyReview} = require('../controllers/customerController')
const {authUser} = require('../middleware/authMiddleware')
const { getAllVehicles } = require('../controllers/adminController')
const { getVehicle } = require('../controllers/vehicleController')
const upload = require('../middleware/multer')
const { createBooking, getBooking, updateBookingStatus, cancelBooking } = require('../controllers/bookingController')
const { createCheckoutSession, getStripeSession, handlePayment } = require('../controllers/paymentController')




customerRouter.post('/register',upload.fields([{name:'profilepic'},{name:'licenseProof'},{name:'addressProof'}]), register)   //   register/signUp
customerRouter.post('/login',login)         //  login

customerRouter.get('/getAllVehicles',getAllVehicles) //get all vehicles
customerRouter.get('/getVehicle/:id',getVehicle) //get vehicle by id


customerRouter.get('/profile',authUser,profile) //profile
customerRouter.get('/logout',authUser,logout) //logout

customerRouter.get('/checkUser' , authUser ,checkUser)

customerRouter.patch('/update',authUser,upload.fields([{name:'profilepic'},{name:'licenseProof'},{name:'addressProof'}]),updateProfile) //update profile
customerRouter.patch('/updatePassword',authUser,UpdatePassword) //update password


customerRouter.post('/review/:vehicleId',authUser, addReview)
customerRouter.get('/getAllReviews',getAllReviews) //get all reviews
customerRouter.get('/myReviews',authUser,getMyReview)
customerRouter.delete('/deleteMyReview/:id',authUser, deleteMyReview) //delete my review
customerRouter.get('getReviewByVehicle/:vehicleId',authUser,getReviewByVehicle)

customerRouter.post('/createBooking/:vehicleId', authUser,createBooking) //create booking
customerRouter.get('/getBooking', authUser, getBooking ) //get booking by user id
customerRouter.patch('/cancelMyBooking/:id', authUser,cancelBooking) //delete booking by id
customerRouter.patch('/updateBookingStatus/:id', authUser,updateBookingStatus)

customerRouter.post('/addPayment',authUser,handlePayment)

customerRouter.post('/create-checkout-session' , authUser,createCheckoutSession)

customerRouter.get('/retrieve-checkout-session/:sessionId', authUser, getStripeSession);



module.exports = customerRouter