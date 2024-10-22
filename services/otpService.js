import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const authKey = process.env.MSG91_AUTH_KEY;

const sendOtp = async (mobileNumber) => {
  const options = {
    method: "POST",
    url: "https://control.msg91.com/api/v5/otp",
    params: {
      otp_expiry: "10",
      template_id: "6717b386d6fc052b50602df2",
      mobile: mobileNumber,
      authkey: authKey,
      realTimeResponse: "1",
    },
    headers: { "Content-Type": "application/JSON" },
    data: '{\n  "Param1": "value1",\n  "Param2": "value2",\n  "Param3": "value3"\n}',
  };

  try {
    const { data } = await axios.request(options);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};

// Send OTP to the specified number
sendOtp("+919523566969", "1234");
