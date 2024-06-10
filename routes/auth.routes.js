const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const User = require('../models/user.model');
const {authSchema} = require('../helpers/validation_schema');
const {signAccessToken,signRefreshToken,verifyRefreshToken, verifyAccessToken} = require('../helpers/jwt_helper');

router.post('/register',async(req, res, next)=>{
    try {
        const result = await authSchema.validateAsync(req.body)

        const doesExist = await User.findOne({email: result.email})
        if(doesExist) throw createError.Conflict(`${result.email} already exists`)

        const user = new User(result)
        const savedUser = await user.save();
        const accessToken = await signAccessToken(savedUser.id)
        const refreshToken = await signRefreshToken(savedUser.id)
        res.send({accessToken,refreshToken})

    } catch (error) {
        if(error.isJoi === true) error.status = 422
        next(error);
    }
});

router.post('/login',async(req, res, next)=>{
    try {
        const result = await authSchema.validateAsync(req.body)
        const user = await User.findOne({email: result.email})

        if(!user) throw createError.NotFound("User not registered");

        const isMatch = await user.isValidPassword(result.password)
        if(!isMatch) throw createError.Unauthorized("Invalid Username/Password")

        const accessToken = await signAccessToken(user.id)
        const refreshToken = await signRefreshToken(user.id)
        console.log("triggered");

        res.send({accessToken,refreshToken})
    } catch (error) {
        if(error.isJoi === true) return next(createError.BadRequest('Invalid Username/Password'))
        next(error)
    }
});

router.post('/refresh-token',async(req, res, next)=>{
    try {
        const {refreshToken} = req.body
        if(!refreshToken) throw createError.BadRequest()
        const userId = await verifyRefreshToken(refreshToken)

        const accessToken = await signAccessToken(userId)
        const refToken = await signRefreshToken(userId)
        res.send({accessToken:accessToken, refreshToken:refToken})
    } catch (error) {
        next(error)
    }
});


router.get('/getUserDetails',verifyAccessToken,async(req,res,next)=>{
    res.send([
        {
          id: 1,
          name: 'Alice Johnson',
          position: 'Software Engineer',
          department: 'Engineering',
          email: 'alice.johnson@example.com',
          phone: '555-1234',
          salary: 75000
        },
        {
          id: 2,
          name: 'Bob Smith',
          position: 'Product Manager',
          department: 'Product',
          email: 'bob.smith@example.com',
          phone: '555-5678',
          salary: 85000
        },
        {
          id: 3,
          name: 'Carol White',
          position: 'UX Designer',
          department: 'Design',
          email: 'carol.white@example.com',
          phone: '555-8765',
          salary: 70000
        },
        {
          id: 4,
          name: 'David Brown',
          position: 'Data Scientist',
          department: 'Data Science',
          email: 'david.brown@example.com',
          phone: '555-4321',
          salary: 90000
        },
        {
          id: 5,
          name: 'Eve Green',
          position: 'HR Specialist',
          department: 'Human Resources',
          email: 'eve.green@example.com',
          phone: '555-6789',
          salary: 60000
        },
        {
          id: 1,
          name: 'Alice Johnson',
          position: 'Software Engineer',
          department: 'Engineering',
          email: 'alice.johnson@example.com',
          phone: '555-1234',
          salary: 75000
        },
        {
          id: 2,
          name: 'Bob Smith',
          position: 'Product Manager',
          department: 'Product',
          email: 'bob.smith@example.com',
          phone: '555-5678',
          salary: 85000
        },
        {
          id: 3,
          name: 'Carol White',
          position: 'UX Designer',
          department: 'Design',
          email: 'carol.white@example.com',
          phone: '555-8765',
          salary: 70000
        },
        {
          id: 4,
          name: 'David Brown',
          position: 'Data Scientist',
          department: 'Data Science',
          email: 'david.brown@example.com',
          phone: '555-4321',
          salary: 90000
        },
        {
          id: 5,
          name: 'Eve Green',
          position: 'HR Specialist',
          department: 'Human Resources',
          email: 'eve.green@example.com',
          phone: '555-6789',
          salary: 60000
        },
        {
          id: 1,
          name: 'Alice Johnson',
          position: 'Software Engineer',
          department: 'Engineering',
          email: 'alice.johnson@example.com',
          phone: '555-1234',
          salary: 75000
        },
        {
          id: 2,
          name: 'Bob Smith',
          position: 'Product Manager',
          department: 'Product',
          email: 'bob.smith@example.com',
          phone: '555-5678',
          salary: 85000
        },
        {
          id: 3,
          name: 'Carol White',
          position: 'UX Designer',
          department: 'Design',
          email: 'carol.white@example.com',
          phone: '555-8765',
          salary: 70000
        },
        {
          id: 4,
          name: 'David Brown',
          position: 'Data Scientist',
          department: 'Data Science',
          email: 'david.brown@example.com',
          phone: '555-4321',
          salary: 90000
        },
        {
          id: 5,
          name: 'Eve Green',
          position: 'HR Specialist',
          department: 'Human Resources',
          email: 'eve.green@example.com',
          phone: '555-6789',
          salary: 60000
        },
        {
          id: 1,
          name: 'Alice Johnson',
          position: 'Software Engineer',
          department: 'Engineering',
          email: 'alice.johnson@example.com',
          phone: '555-1234',
          salary: 75000
        },
        {
          id: 2,
          name: 'Bob Smith',
          position: 'Product Manager',
          department: 'Product',
          email: 'bob.smith@example.com',
          phone: '555-5678',
          salary: 85000
        },
        {
          id: 3,
          name: 'Carol White',
          position: 'UX Designer',
          department: 'Design',
          email: 'carol.white@example.com',
          phone: '555-8765',
          salary: 70000
        },
        {
          id: 4,
          name: 'David Brown',
          position: 'Data Scientist',
          department: 'Data Science',
          email: 'david.brown@example.com',
          phone: '555-4321',
          salary: 90000
        },
        {
          id: 5,
          name: 'Eve Green',
          position: 'HR Specialist',
          department: 'Human Resources',
          email: 'eve.green@example.com',
          phone: '555-6789',
          salary: 60000
        }
      ])
})

router.delete('/logout',async(req, res, next)=>{
    res.send("logout route")
});


module.exports = router