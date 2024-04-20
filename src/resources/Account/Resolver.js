import Account from "./Model.js";
import Checkout from "../Checkout/Model.js";
import User from "../User/Model.js";

import bcrypt from "bcryptjs";
import { sendMail } from "sud-libs";
import { mailForm } from "../../utils/index.js";
import { hashBcrypt } from "../../utils/crypto/crypto.js";
import QRCODE from "qrcode";
import dotenv from "dotenv";
/*  
    Sẽ setup phần send email và dotenv (github - delirate)
*/
dotenv.config();

const secretKey = process.env.SECRET_KEY || "nkeyskuo";

const auth = {
  user: process.env.HOST_EMAIL,
  pass: process.env.HOST_PASSWORD,
};

async function POST_register(req, res, next) {
  const { email, password, confirm_password, full_name, phone } = req.body;

  // Validate email
  if (!email.includes("@")) {
    return res.json({
      success: false,
      status: 300,
      msg: `Invalid email`,
    });
  }

  // Validate password with confirm_password
  if (password != confirm_password) {
    return res.json({
      success: false,
      status: 300,
      msg: `Invalid password`,
    });
  }

  //   Validate password length
  if (password.length < 8) {
    return res.json({
      success: false,
      status: 300,
      msg: `Password at least 8 characters.`,
    });
  }

  //   Validate phone number length
  if (phone.length != 10) {
    return res.json({
      success: false,
      status: 300,
      msg: `Phone number need 10 numbers`,
    });
  }

  // Validate empty input box
  if (!email || !password || !full_name || !phone) {
    return res.json({
      success: false,
      status: 400,
      msg: `Please fullfill inputs.`,
    });
  }

  // Validate register credentials
  let register_account = await Account.findOne({
    email: email,
  });

  if (register_account) {
    return res.json({
      success: false,
      status: 300,
      mng: `Email used`,
    });
  }

  // Try/Catch to register new account
  try {
    let new_account = await new Account({
      email,
      avatar: folder + "/" + file.filename,
      password: hashBcrypt(password),
      full_name,
      phone,
    }).save();

    await new User({
      email: email,
      full_name: full_name,
      phone: phone,
    }).save();

    // Send validation email
    const options = {
      from: auth.user,
      to: email,
      subject: "Thông tin tài khoản DigiKey",
      html: mailForm({
        logo_link:
          "https://lh3.googleusercontent.com/frn4WyFNdrJtHzDgKkfKNLxxBRz-TfCUplE9R4wn8vT98frHPXJcyWA6AV3zMBV8M2JlslnofdO5jOQN1Qb_uGa8jw=w640-h400-e365-rj-sc0x00ffffff",
        caption: "DigiKey account authentication",
        content: `<p>Username: ${email}</p>`,
      }),
    };

    sendMail(auth, options, (err) => {
      if (err) {
        console.log(err);
      }
    });

    return res.json({
      success: true,
      status: 200,
      data: new_account,
      msg: `Account registered`,
    });
  } catch (error) {
    return res.json({
      success: false,
      status: 500,
      msg: `Register account failed` + err,
    });
  }
}

async function POST_login(req, res, next) {
  const { email, password } = req.body;

  const my_account = await Account.findOne({ email: email }).lean();

  if (!my_account) {
    return res.json({
      success: false,
      status: 300,
      msg: `Account not found`,
    });
  }

  if (my_account.status != "activate") {
    return res.json({
      success: false,
      status: 300,
      msg: "Your account is deactivated",
    });
  }

  // Version 1: My version
  if (my_account) {
    if (bcrypt.compareSync(password, my_account.password)) {
      return res.json({
        success: true,
        status: 200,
        msg: `Login successfully`,
        data: {
          email: email,
          _id: my_account._id,
        },
      });
    } else {
      return res.json({
        success: false,
        msg: `Incorrecrt password`,
      });
    }
  } else {
    return res.json({
      success: false,
      status: 300,
      msg: `Account doesn't exist`,
    });
  }

  //   // Version 2: Kuo version
  //   if (!bcrypt.compareSync(password, my_account.password)) {
  //     return res.json({
  //       success: false,
  //       status: 300,
  //       msg: "Incorrect password",
  //     });
  //   }

  //   let user = await User.findOne({ email: my_account.email }).then(
  //     async (user) => {
  //       if (user) {
  //         return user;
  //       }

  //       return await new User({
  //         name: my_account.name,
  //         email: my_account.email,
  //         phone: my_account.phone,
  //       }).save();
  //     }
  //   );
}

async function GET_login(req, res, next) {
  return res.json("home");
}

export { POST_register, POST_login, GET_login };
