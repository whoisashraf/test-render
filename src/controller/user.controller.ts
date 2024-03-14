import { Request, Response } from "express";
import {
  createUser,
  createVendorUser,
  findAndUpdate,
  findAndUpdateVendor,
  findUser,
  findUsers,
} from "../service/users/createUser";
import User, { UserDocument } from "../model/user.model";
import { omit, get } from "lodash";
import log from "../logger";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodeMailer from "nodemailer";
import {
  findStore,
  findAndUpdate as findAndUpdateUserStore,
} from "../service/store/store.service";

let transporter = nodeMailer.createTransport({
  host: "smtp.zoho.com",
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL_DOMAIN,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const createUserHandler = async (req: Request, res: Response) => {
  try {
    const userEmail = get(req, "body.email");

    const userExist = await findUser({ email: req.body.email }, {});

    if (userExist) {
      return res.status(403).json({
        status: 403,
        message: " User with same email already exists",
      });
    }

    if (req.body.phoneNum) {
      const userPhone = get(req, "body.phoneNum");

      const userPhoneExist = await findUser(
        {
          phoneNum: userPhone,
        },
        {}
      );

      if (userPhoneExist) {
        return res.status(409).json({
          status: 409,
          message: " User with same phone already exists",
        });
      }
    }

    let newUser = req.body;
    newUser.role = "buyer";

    console.log("newUser", newUser);
    const user = await createUser(req.body);
    return res.send(omit(user.toJSON(), "password"));
  } catch (error) {
    const newError = error as any;
    log.error(newError);
    res.status(409).send(newError.message);
  }
};
export const createAdminUserHandler = async (req: Request, res: Response) => {
  try {
    const userEmail = get(req, "body.email");

    console.log("body", req.body);
    const userExist = await findUser({ email: req.body.email }, {});

    if (userExist) {
      return res.status(403).json({
        status: 403,
        message: " User with same email already exists",
      });
    }

    if (req.body.phoneNum) {
      const userPhone = get(req, "body.phoneNum");

      const userPhoneExist = await findUser(
        {
          phoneNum: userPhone,
        },
        {}
      );

      if (userPhoneExist) {
        return res.status(409).json({
          status: 409,
          message: " User with same phone already exists",
        });
      }
    }

    let newUser = req.body;
    newUser.role = "admin";

    console.log("newUser", newUser);
    const user = await createUser(req.body);
    return res.send(omit(user.toJSON(), "password"));
  } catch (error) {
    const newError = error as any;
    log.error(newError);
    res.status(409).send(newError.message);
  }
};

export const createVendorUserHandler = async (req: Request, res: Response) => {
  try {
    const userEmail = get(req, "body.email");

    console.log("body", req.body);
    const userExist = await findUser({ email: req.body.email }, {});

    if (userExist) {
      return res.status(403).json({
        status: 403,
        message: " User with same email already exists",
      });
    }

    if (req.body.phoneNum) {
      const userPhone = get(req, "body.phoneNum");

      const userPhoneExist = await findUser(
        {
          phoneNum: userPhone,
        },
        {}
      );

      if (userPhoneExist) {
        return res.status(409).json({
          status: 409,
          message: " User with same phone already exists",
        });
      }
    }

    let newUser = req.body;
    newUser.role = "seller";

    console.log("newUser", newUser);
    const user = await createVendorUser(req.body);
    return res.send(omit(user.toJSON(), "password"));
  } catch (error) {
    const newError = error as any;
    log.error(newError);
    res.status(409).send(newError.message);
  }
};

export const getUsersHandler = async (req: Request, res: Response) => {
  try {
    const userRole = get(req, "user.role");

    if (userRole !== "admin") {
      return res.status(403).json({
        status: 403,
        message: " You are not authorized to access this resource",
      });
    }

    const users = await findUsers({ deleted: false }, { password: 0 });

    if (!users) {
      return res.status(404).json({
        status: 404,
        message: " No users found",
      });
    }

    res.status(200).json({ users });
  } catch (error) {
    const newError = error as any;
    log.error(newError);
    res.status(409).send(newError.message);
  }
};

export const getSingleUser = async (req: Request, res: Response) => {
  try {
    const userRole = get(req, "user.role");
    const userId = get(req, "params.userId");

    if (userRole !== "admin" && userId !== get(req, "user._id")) {
      return res.status(403).json({
        status: 403,
        message: " You are not authorized to access this resource",
      });
    }

    const users = await findUser(
      { _id: userId, deleted: false },
      { password: 0 }
    );

    if (!users) {
      return res.status(404).json({
        status: 404,
        message: " No users found",
      });
    }

    res.status(200).json({ users });
  } catch (error) {
    const newError = error as any;
    log.error(newError);
    res.status(409).send(newError.message);
  }
};

export const updateUserHandler = async (req: Request, res: Response) => {
  try {
    const userEmail = get(req, "user.email");

    const userExist = await findUser({ email: userEmail });

    if (!userExist) {
      return res.status(403).json({
        status: 403,
        message: " User does not exists",
      });
    }

    let newUser = req.body;
    newUser = omit(newUser, "password");

    const user = await findAndUpdate(
      { email: userEmail },
      { ...newUser },
      { new: true }
    );

    return res.status(200).json({
      message: `User ${userEmail} updated successfully`,
      //@ts-expect-error
      user: omit(user.toJSON(), "password"),
    });
  } catch (error) {
    const newError = error as any;
    log.error(newError);
    log.info("<<< AN ERROR OCCURED WHILE UPDATING USER >>>");
    res.status(409).send(newError.message);
  }
};

export const updateUserVendorHandler = async (req: Request, res: Response) => {
  console.log("got here");
  try {
    const userEmail = get(req, "body.email");
    const isAdmin = get(req, "user.role");

    if (isAdmin !== "admin") {
      return res.status(403).json({
        status: 403,
        message: " You are not authorized to access this resource",
      });
    }

    const userExist = await findUser({ email: userEmail });

    if (!userExist) {
      return res.status(403).json({
        status: 403,
        message: " User does not exists",
      });
    }

    let newUser = req.body;
    newUser = omit(newUser, "password");
    newUser = omit(newUser, "email");
    let brandName = get(req, "body.brandName");

    if (brandName !== "") {
      let userStore = await findStore({ userId: userExist._id });

      if (userStore) {
        userStore.storeName = brandName;
        await findAndUpdateUserStore(
          { userId: userExist._id },
          { storeName: brandName },
          { new: true }
        );
      } else log.info("No store found for user");
    }

    console.log(newUser);
    const user = await findAndUpdateVendor(
      { email: userEmail },
      { ...newUser },
      { new: true }
    );

    return res.status(200).json({
      message: `User ${userEmail} updated successfully`,
      //@ts-expect-error
      user: omit(user.toJSON(), "password"),
    });
  } catch (error) {
    const newError = error as any;
    log.error(newError);
    log.info("<<< AN ERROR OCCURED WHILE UPDATING USER >>>");
    res.status(409).send(newError.message);
  }
};

export const createUserSessionHandler = async (req: Request, res: Response) => {
  try {
    const user = await createUser(req.body);
    return res.send(omit(user.toJSON(), "password"));
  } catch (error) {
    const newError = error as any;
    log.error(newError);
    res.status(409).send(newError.message);
  }
};

export const resetPasswordHandler = async (req: Request, res: Response) => {
  try {
    // const user = get(req, "user");
    let { email } = get(req, "body");
    console.log("gotHere reset");
    const user = await findUser({ email });

    if (!user) {
      return res.status(403).json({
        status: 403,
        message: " User does not exists",
      });
    }

    //@ts-ignore
    const secret = process.env.secretOrPrivateKey + user?.password;
    const payload = {
      email,
      //@ts-ignore
      id: user.id,
    };

    const token = jwt.sign(payload, secret, { expiresIn: "15m" });
    const link = `${
      process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_LOCAL_HOST
        : process.env.PROD_HOST
    }/reset-password/${user._id}/${token}`;

    const data = {
      from: "noreply@automationlounge.com",
      to: email,
      subject: "Password reset",
      html: `
        <h2> Pls click on the link bellow to reset your password</h2>
        <p><a href=${link} > Click here to reset your Password </a></p>
        <p>${link}</p>
      `,
    };
    log.info("<<< link generated >>>");

    //nodeMailer implementation
    const mailOptions = {
      from: process.env.EMAIL_DOMAIN, // sender address
      to: data.to, // sender
      subject: data.subject, // Subject line
      html: data.html, // plain text body
    };

    const msg = await transporter.sendMail(mailOptions);

    log.info("<<< Reset link sent to user mail >>>");

    if (!msg) {
      return res.status(500).json({
        status: 500,
        message: "Error sending email",
      });
    }

    return res.status(200).json({
      // msg,
      message: `Reset link sent to ${data.to} Successfully`,
    });
  } catch (error) {
    const newError = error as any;
    log.error(newError);
    res.status(500).send(newError.message);
  }
};

// verifyPasswordHandler
export const verifyTokenHandler = async (req: Request, res: Response) => {
  try {
    const userId = get(req.params, "id");
    const token = get(req.params, "token");
    const user = await findUser({ _id: userId });

    // console.log(req.params)
    if (!user) {
      return res.status(403).json({
        status: 403,
        message: " User does not exists",
      });
    }

    const secret = process?.env?.secretOrPrivateKey + user?.password;
    //@ts-ignore
    const payload = jwt.verify(token, secret);

    return res.status(200).json({
      data: payload,
      message: "Successfully verified token",
    });
  } catch (error) {
    const newError = error as any;
    log.error(newError);
    res.status(500).send(newError.message);
  }
};

// verifyPasswordHandler
export const resetUserPasswordHandler = async (req: Request, res: Response) => {
  try {
    console.log("got here");

    const userId = get(req.params, "id");
    const token = get(req.params, "token");
    const password = get(req.body, "password");
    console.log("params >>", req.params);

    const user = await findUser({ _id: userId });

    if (!user) {
      return res.status(403).json({
        status: 403,
        message: " User does not exists",
      });
    }

    //@ts-ignore
    const secret = process?.env?.secretOrPrivateKey + user?.password;
    //@ts-ignore
    const payload = jwt.verify(token, secret);
    //@ts-ignore
    const salt = await bcrypt.genSalt(
      parseInt(process.env.saltWorkFactor as string)
    );
    const hash = await bcrypt.hashSync(password, salt);
    const updatedUser = findAndUpdate(
      { _id: user._id },
      { password: hash },
      { new: true }
    );

    return res.status(200).json({
      updatedUser,
      message: "Successfully updated user password",
    });
  } catch (error) {
    const newError = error as any;
    log.error(newError);
    res.status(500).json({ message: newError.message });
  }
};

export const deleteUserHandler = async (req: Request, res: Response) => {
  try {
    const userId = get(req, "params.id");
    const user = await findAndUpdate(
      { _id: userId },
      { $set: { deleted: true } },
      { new: true }
    );

    return res.status(201).json({
      status: 201,
      message: "user deleted successfully",
      user,
    });
  } catch (err) {
    log.error(err);
    return res.status(500).json({
      status: 500,
      message: "Oops, something went wrong. Please try again later!!",
    });
  }
};

// export const addAddressHandler = async (req: Request, res: Response) => {
//   try {
//     const userEmail = get(req, "user.email");
//     const body = get(req, "body");
//     const { address, city, state, country } = body
//     const userExist = await findUser({ email: userEmail }, {});

//     if (!userExist) {
//       return res.status(403).json({
//         status: 403,
//         message: " User does not exists",
//       });
//     }

//     const { addresses } = userExist

//     if(addresses.length >= 3 ){
//       return res.status(403).json({
//         status: 403,
//         message: "You have reached the limit of 3 addresses delete one to add another"
//       })
//     }

//     let newAddress = {
//       city,
//       address,
//       country,
//       state,
//     }

//     const updateUser = await findAndUpdate({ email: userEmail }, { $push: { "addresses": newAddress }}, { new: true})

//     return res.status(200).json({
//       address: newAddress,
//       message: `Address added successfully`,
//     })
//   } catch (error) {
//     const newError = error as any;
//     log.error(newError);
//     res.status(409).send(newError.message);
//   }
// };

// export const updateAddressHandler = async (req: Request, res: Response) => {
//   try {
//     const userEmail = get(req, "user.email");
//     const body = get(req, "body");
//     const {
//       address,
//       city,
//       state,
//       //@ts-ignore
//       isDefault,
//       addressId,
//       country } = body;
//     const userExist = await findUser({ email: userEmail }, {});

//     if (!userExist) {
//       return res.status(403).json({
//         status: 403,
//         message: " User does not exists",
//       });
//     }

//     const { addresses } = userExist
//     console.log(typeof addresses)

//     if(addresses && addresses.length >= 0 ){
//       // @ts-ignore
//       const currentArress = addresses?.filter(address => String(address._id) === String(addressId));

//       if(currentArress.length < 1) return res.status(402).json({
//           message: `No address with the current adrressId ${addressId}`,
//         })

//       currentArress[0].city = city;
//       currentArress[0].state = state;
//       currentArress[0].address = address;
//       currentArress[0].country = country;
//       currentArress[0].default = isDefault ? isDefault : false;

//       const updateUser = await findAndUpdate({ email: userEmail }, { $set: { "addresses": addresses }}, { new: true })

//       return res.status(200).json({
//         address: updateUser?.addresses,
//         message: `Address added successfully`,
//       })

//     }

//        let newAddress = {
//          city,
//          address,
//          country,
//          state,
//          default: isDefault ? isDefault : false
//        }

//        const updateUser = await findAndUpdate({ email: userEmail }, { $set: { "addresses": [ newAddress ] }}, { new: true })

//        return res.status(200).json({
//          address: updateUser?.addresses,
//          message: `Address added successfully`,
//        })

//   } catch (error) {
//     const newError = error as any;
//     log.error(newError);
//     res.status(409).send(newError.message);
//   }
// };

// export const deleteAddressHandler = async (req: Request, res: Response) => {
//   try {
//     const userEmail = get(req, "user.email");
//     const addressId = get(req, "params.id");

//     const userExist = await findUser({ email: userEmail }, {});

//     if (!userExist) {
//       return res.status(403).json({
//         status: 403,
//         message: " User does not exists",
//       });
//     }

//     const updateUser = await findAndUpdate({ email: userEmail }, { $pull: { "addresses": { _id: addressId } }}, { new: true})

//     return res.status(200).json({
//       message: `Address deleted successfully`,
//     })
//   } catch (error) {
//     const newError = error as any;
//     log.error(newError);
//     res.status(409).send(newError.message);
//   }
// };

// export const getUserddressHandler = async (req: Request, res: Response) => {
//   try {
//     const userEmail = get(req, "user.email");
//     const userExist = await findUser({ email: userEmail }, {});

//     if (!userExist) {
//       return res.status(403).json({
//         status: 403,
//         message: " User does not exists",
//       });
//     }

//     return res.status(200).json({
//       message: `Address fetched successfully`,
//       addresses: userExist.addresses
//     })
//   } catch (error) {
//     const newError = error as any;
//     log.error(newError);
//     res.status(409).send(newError.message);
//   }
// };
