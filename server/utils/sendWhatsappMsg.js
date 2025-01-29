import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
export const sendWhatsAppMessage = async (phoneNumber, message) => {
   const url = "https://7105.api.greenapi.com/waInstance7105183147/sendMessage/8df5da7c53b649f28af6381fca688b467f5ecee575eb41a99b"

   const payload = {
      chatId: `${phoneNumber}@c.us`,
      message: message,

   };

   try {
      const response = await axios.post(url, payload);
      console.log('Message sent:', response.data);
   } catch (error) {
      console.error('Error sending message:', error);
   }
};
