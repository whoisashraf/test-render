import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";
import { USER_TYPE } from "../utils/Constants";

export interface UserDocument extends mongoose.Document {
  lastName: string;
  firstName: string;
  dob: Date;
  username: string;
  email: string;
  password: string;
  img: string;
  location: string;
  phoneNum: string;
  role: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePasswords: string): Promise<boolean>;
}

export interface AddressesDocument extends mongoose.Document {
  address: string;
  city: string;
  state: string;
  country: number;
  firstName: number;
  lastname: number;
  phoneNum: number;
  default: boolean;
  additionalPhoneNumber: number;
}

const Address = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  phoneNum: {
    type: String,
    required: true,
  },
  additionalPhoneNumber: {
    type: String,
    required: true,
  },
  default: {
    type: Boolean,
    required: false,
    default: false,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: false,
  },
});

const userSchema = new mongoose.Schema(
  {
    lastName: {
      type: String,
      required: false,
      unique: false,
    },
    firstName: {
      type: String,
      required: false,
      unique: false,
    },
    username: {
      type: String,
      required: false,
      unique: false,
    },
    img: {
      type: String,
      required: false,
      unique: false,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNum: {
      type: String,
      required: true,
      unique: true,
    },
    dob: {
      type: Date,
      required: false,
    },
    location: {
      type: String,
      required: [true, "please enter your location"],
    },
    role: {
      type: String,
      required: false,
      enum: USER_TYPE,
      default: "buyer",
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  let user = this as UserDocument;

  //only hash the password if it has been modified or new
  if (!user.isModified("password")) return next();

  //get salt
  const salt = await bcrypt.genSalt(
    parseInt(process.env.saltWorkFactor as any)
  );
  // const salt = await bcrypt.genSalt(config.get("saltWorkFactor"));

  const hash = await bcrypt.hashSync(user.password, salt);

  // Replace the password with the hash
  user.password = hash;

  return next();
});

//Used for logging in users
userSchema.methods.comparePassword = async function (
  candidatePasswords: string
) {
  const user = this as UserDocument;

  return bcrypt.compare(candidatePasswords, user.password).catch((e) => false);
};

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
