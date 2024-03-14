import mongoose from "mongoose";
import { AVAILABILITY, ID_TYPE, USER_STATUS, USER_TYPE } from "../utils/Constants";
import User from "./user.model";

export interface VendorDocument extends mongoose.Document {
  lastName: string;
  firstName: string;
  dob: Date;
  username: string;
  email: string;
  password: string;
  img: string;
  BusinessInfo: BusinessInfoDocument;
  businessAccountDetails: BankDocument;
  phoneNum: string;
  additionalPhoneNum: string;
  city: string;
  country: string;
  availability: string;
  brandName: string;
  role: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePasswords: string): Promise<boolean>;
}

export interface BankDocument extends mongoose.Document {
  bankName: string;
  accountType: string;
  accountNum: string;
  accountName: number;
  alternateAccountName: number;
  alternateBank: number;
  alternateBankType: number;
  alternateAccountNum: boolean;
}

export interface BusinessInfoDocument extends mongoose.Document {
  kitchenName: string;
  address1: string;
  address2: string;
  city: number;
  postalCode: number;
  foundersFullName: number;
  foundersDob: number;
  foundersIdType: boolean;
  id: number;
  branches: number;
  mainBranch: number;
  cac: number;
  cacImg: number;
  tinImg: number;
}

const BusinessInfo = new mongoose.Schema(
    { 
      kitchenName: {
        type: String,
        required: true,
        unique: false,
      },
      address1: {
        type: String,
        required: true,
        unique: false,
      },
      address2: {
        type: String,
        required: false,
        unique: false,
      },
      city: {
        type: String,
        required: true,
        unique: false,
      },
      postalCode: {
        type: String,
        required: true,
        unique: false,
      },
      foundersFullName: {
        type: String,
        required: true,
        unique: false,
      },
      foundersDob: {
        type: Date,
        required: true,
        unique: false,
      },
      foundersIdType: {
        type: String,
        required: true,
        unique: false,
        enum: ID_TYPE,
      },
      id: {
        type: String,
        required: true,
        unique: false,
      },
      branches: {
        type: String,
        required: true,
        unique: false,
      },
      mainBranch: {
        type: String,
        required: true,
        unique: false,
      },
      cac: {
        type: String,
        required: true,
        unique: false,
      },
      cacImg: {
        type: String,
        required: true,
        unique: false,
      },
      tinImg: {
        type: String,
        required: true,
        unique: false,
      }
    }
);

const BankDetails = new mongoose.Schema(
  { 
    bankName: {
      type: String,
      required: true,
      unique: false,
    },
    accountType: {
      type: String,
      required: true,
      unique: false,
    },
    accountNum: {
      type: String,
      required: true,
      unique: false,
    },
    accountName: {
      type: String,
      required: true,
      unique: false,
    },
    alternateAccountName: {
      type: String,
      required: true,
      unique: false,
    },
    alternateBank: {
      type: String,
      required: true,
      unique: false,
    },
    alternateBankType: {
      type: String,
      required: true,
      unique: false,
    },
    alternateAccountNum : {
      type: Number,
      required: true,
      unique: false,
    }
  }
);

const vendorSchema = new mongoose.Schema(
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
      unique: true
    },
    additionalPhoneNum: {
        type: String,
        required: false,
        unique: true
    },
    availability: {
      type: String,
      required: false,
      enum: AVAILABILITY,
      default: 'weekdays'
    },
    brandName: {
      type: String,
      required: false,
    },
    BusinessInfo: {
      type: BusinessInfo,
      required: true,
    },
    businessAccountDetails: {
      type: BankDetails,
      required: true,
    },
    dob: {
      type: Date,
      required: false,
    },
    role: {
      type: String,
      required: false,
      enum: USER_TYPE,
      default: 'seller'
    },
    status: {
      type: String,
      required: false,
      enum: USER_STATUS,
      default: "Not-Confirmed"
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

const Vendor = User.discriminator<VendorDocument>("Vendor", vendorSchema);

export default Vendor;