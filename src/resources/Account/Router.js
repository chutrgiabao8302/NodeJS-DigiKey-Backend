import express from "express";
import { POST_register, POST_login, GET_login } from "./Resolver";

const router = express.Router();

/**
 * Description: Register a new account
 * Request: POST /account/register
 * Send: { email, password, confirm_password, full_name, phone }
 * Receive: 200 if success, otherwise fail
 */

router.post("/register", POST_register);

/**
 * Description: Log in to the system
 * Request: POST account/login/
 * Send: { email, password}
 * Receive: 200 if success, other fail
 */
router.post("/login", POST_login);

router.get("/login", GET_login);

export default router;
