import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const sendOTP = async (toNumber, otp) => {
    try {
        const response = await axios.post(
            "https://www.fast2sms.com/dev/bulkV2",
            {
                route: "v3",
                sender_id: "TXTIND",
                message: `Your OTP is ${otp}`,
                language: "english",
                flash: 0,
                numbers: toNumber,
            },
            {
                headers: {
                    authorization: process.env.FAST2SMS_AUTH_KEY,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("OTP sent successfully:", response.data);
        return response;
    } catch (error) {
        return error;
    }
};

export { sendOTP };
