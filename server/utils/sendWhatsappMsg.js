const axios = require('axios');
require('dotenv').config();

export const sendWhatsAppMessage = async (phoneNumber, message) => {
   const url = `https://api.green-api.com/waInstance${process.env.ID_INSTANCE}/sendMessage/${process.env.API_TOKEN_INSTANCE}`;

   const payload = {
      chatId: `${phoneNumber}@c.us`,
      message: message
   };

   try {
      const response = await axios.post(url, payload);
      console.log('Message sent:', response.data);
   } catch (error) {
      console.error('Error sending message:', error.response.data);
   }
};

sendWhatsAppMessage('919876543210', 'Your booking has been confirmed!');