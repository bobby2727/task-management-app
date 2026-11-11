const express = require("express")

const router = express.Router()

const {signup, login} = require("../controllers/authControllers")

const protect = require("../middleware/authMiddleware")

router.post("/signup", signup);

router.post("/login", login)

router.get("/protected", protect, (req, res)=>{
    res.status(200).json({
        message:"You accessed a proteted route successfully",
        user:{
            id: req.user._id,
            name: req.user.name,
            email: req.user.email
        }
    })
})

module.exports = router;