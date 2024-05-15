import express from "express";

const router = express.Router()

import { singup, singin, logout } from '../controllers/auth.controller.js'

router.post('/signin', singin)
router.post('/signup', singup)
router.post('/logout', logout)

export default router;