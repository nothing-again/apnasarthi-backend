import MSG91 from "msg91-sms";
import dotenv from "dotenv";

dotenv.config();

const authKey = process.env.MSG91_AUTH_KEY;
const senderId = process.env.MSG91_SENDER_ID;

const otpService = {
    sendOtp: async (mobileNumber, otp) => {
        const client = new MSG91(authKey, senderId, 4);
        const message = `Your OTP is ${otp}. It is valid for 5 minutes.`;
        try {
            const response = await client.send(mobileNumber, message);
            console.log(response);
            return response;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
};

export default otpService;

// Send OTP to the specified number
otpService.sendOtp("919523566969", "1234");
