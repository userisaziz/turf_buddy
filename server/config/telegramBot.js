import TelegramBot from "node-telegram-bot-api";
import Calendar from "telegram-inline-calendar";
import {
  getAvailableTurfs,
  authenticateUser,
  reserveSlotFromBot,
  getTimeSlotByTurfId,
} from "../services/botService.js";

import { format } from "date-fns";

// 🔹 Bot Token
const TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
process.env.NTBA_FIX_319 = 1; // Fix for Telegram Bot API

// 🔹 Initialize Telegram Bot & Calendar
const bot = new TelegramBot(TOKEN, { polling: true });
const calendar = new Calendar(bot, {
  date_format: "DD-MM-YYYY",
  language: "en",
});

// 🔹 Booking State
const bookingState = new Map();

export const startTelegramBot = () => {
  console.log("🚀 Telegram Bot is running...");

  // 🔹 Start Command
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
      chatId,
      "Welcome! Please enter your email to start the booking process:"
    );
    bookingState.set(chatId, { step: "login" });
  });

  // 🔹 Handling Messages
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const state = bookingState.get(chatId);

    if (state) {
      switch (state.step) {
        case "login":
          state.email = msg.text;
          state.step = "password";
          bot.sendMessage(chatId, "Please enter your password:");
          break;

        case "password":
          state.password = msg.text;
          const authResponse = await authenticateUser(
            state.email,
            state.password
          );

          if (authResponse.success) {
            state.userId = authResponse.userId;
            state.step = "select_turf";

            // 🔹 Fetch available turfs
            const turfs = await getAvailableTurfs(state.userId);
            if (turfs.length > 0) {
              const turfButtons = turfs.map((turf) => [
                { text: turf.name, callback_data: `turf_${turf.id}` },
              ]);
              bot.sendMessage(chatId, "Select a turf:", {
                reply_markup: { inline_keyboard: turfButtons },
              });
            } else {
              bot.sendMessage(chatId, "❌ No turfs available.");
              bookingState.delete(chatId);
            }
          } else {
            bot.sendMessage(chatId, "❌ Login failed. Please try again.");
            bookingState.delete(chatId);
          }
          break;
      }
    }
  });

  // 🔹 Handling Inline Buttons
  bot.on("callback_query", async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;
    const state = bookingState.get(chatId);

    if (!state) return;

    // 🔹 User selects a turf
    if (data.startsWith("turf_")) {
      state.turfId = data.split("_")[1];
      state.step = "select_date";

      bot.sendMessage(chatId, "📅 Please select a date:", {
        reply_markup: calendar.startNavCalendar(query.message),
      });
    }
    if (query.message.message_id == calendar.chats.get(query.message.chat.id)) {
      var res;
      res = calendar.clickButtonCalendar(query);
      console.log(res);
      if (res !== -1) {
        bot.sendMessage(query.message.chat.id, "You selected: " + res);
        try {
          // ✅ Fetch available time slots
          console.log(res);
          const response = await getTimeSlotByTurfId(res, state.turfId);
          const { timeSlots, bookedTime } = response;

          // Generate available slots
          const availableSlots = [];
          const operatingHours = {
            start: new Date(res).setHours(8, 0, 0, 0), // 8 AM
            end: new Date(res).setHours(22, 0, 0, 0), // 10 PM
          };

          for (
            let time = operatingHours.start;
            time < operatingHours.end;
            time += 30 * 60 * 1000
          ) {
            const slotStart = new Date(time);
            const slotEnd = new Date(time + 30 * 60 * 1000);
            const isBooked = bookedTime.some((booking) => {
              const bookingStart = new Date(booking.startTime).getTime();
              const bookingEnd = new Date(booking.endTime).getTime();
              return (
                (slotStart.getTime() < bookingEnd &&
                  slotStart.getTime() >= bookingStart) ||
                (slotEnd.getTime() > bookingStart &&
                  slotEnd.getTime() <= bookingEnd)
              );
            });

            if (!isBooked) {
              availableSlots.push({
                startTime: slotStart.toISOString(),
                endTime: slotEnd.toISOString(),
              });
            }
          }

          if (availableSlots.length > 0) {
            const slotButtons = availableSlots.map((slot) => [
              {
                text: `${format(
                  new Date(slot.startTime),
                  "hh:mm a"
                )} - ${format(new Date(slot.endTime), "hh:mm a")}`,
                callback_data: `slot_${slot.startTime}_${slot.endTime}`,
              },
            ]);

            // ✅ Show available slots
            bot.sendMessage(chatId, "⏰ Select a time slot:", {
              reply_markup: { inline_keyboard: slotButtons },
            });
          } else {
            bot.sendMessage(chatId, "❌ No slots available for this date.");
            bookingState.delete(chatId);
          }
        } catch (error) {
          console.error("Error fetching time slots:", error);
          bot.sendMessage(
            chatId,
            "❌ Error fetching time slots. Please try again."
          );
        }
      }
    }
    // 🔹 User selects a date
    else if (data.startsWith("date_")) {
      const selectedDate = data.split("_")[1];
      console.log(selectedDate);
      state.date = selectedDate;
      state.step = "select_slot";

      // ✅ Show the selected date
      bot.sendMessage(chatId, `📅 You selected: *${selectedDate}*`, {
        parse_mode: "Markdown",
      });

      try {
        // ✅ Fetch available time slots
        const response = await getTimeSlotByTurfId(selectedDate, state.turfId);
        const { timeSlots, bookedTime } = response.data;

        // Generate available slots
        const availableSlots = [];
        const operatingHours = {
          start: new Date(selectedDate).setHours(8, 0, 0, 0), // 8 AM
          end: new Date(selectedDate).setHours(22, 0, 0, 0), // 10 PM
        };

        for (
          let time = operatingHours.start;
          time < operatingHours.end;
          time += 30 * 60 * 1000
        ) {
          const slotStart = new Date(time);
          const slotEnd = new Date(time + 30 * 60 * 1000);
          const isBooked = bookedTime.some((booking) => {
            const bookingStart = new Date(booking.startTime).getTime();
            const bookingEnd = new Date(booking.endTime).getTime();
            return (
              (slotStart.getTime() < bookingEnd &&
                slotStart.getTime() >= bookingStart) ||
              (slotEnd.getTime() > bookingStart &&
                slotEnd.getTime() <= bookingEnd)
            );
          });

          if (!isBooked) {
            availableSlots.push({
              startTime: slotStart.toISOString(),
              endTime: slotEnd.toISOString(),
            });
          }
        }

        if (availableSlots.length > 0) {
          const slotButtons = availableSlots.map((slot) => [
            {
              text: `${format(new Date(slot.startTime), "hh:mm a")} - ${format(
                new Date(slot.endTime),
                "hh:mm a"
              )}`,
              callback_data: `slot_${slot.startTime}_${slot.endTime}`,
            },
          ]);

          // ✅ Show available slots
          bot.sendMessage(chatId, "⏰ Select a time slot:", {
            reply_markup: { inline_keyboard: slotButtons },
          });
        } else {
          bot.sendMessage(chatId, "❌ No slots available for this date.");
          bookingState.delete(chatId);
        }
      } catch (error) {
        console.error("Error fetching time slots:", error);
        bot.sendMessage(
          chatId,
          "❌ Error fetching time slots. Please try again."
        );
      }
    }

    // 🔹 User selects a slot
    else if (data.startsWith("slot_")) {
      const [startTime, endTime] = data.split("_").slice(1);
      state.startTime = startTime;
      state.endTime = endTime;
      state.step = "confirm_booking";

      bot.sendMessage(
        chatId,
        `✅ Confirm booking:\n📍 Turf: ${state.turfId}\n📅 Date: ${
          state.date
        }\n⏰ Time: ${format(new Date(startTime), "hh:mm a")} - ${format(
          new Date(endTime),
          "hh:mm a"
        )}\nPress confirm to proceed.`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: "Confirm ✅", callback_data: "confirm_booking" }],
            ],
          },
        }
      );
    }

    // 🔹 User confirms booking
    else if (data === "confirm_booking") {
      const bookingData = {
        userEmail: state.email,
        turfId: state.turfId,
        startTime: state.startTime,
        endTime: state.endTime,
        selectedTurfDate: state.date,
      };

      const result = await reserveSlotFromBot(bookingData);
      if (result.success) {
        bot.sendMessage(
          chatId,
          "✅ Booking successful! 🎉 Check your email for the confirmation."
        );
      } else {
        bot.sendMessage(chatId, "❌ Booking failed: " + result.message);
      }
      bookingState.delete(chatId);
    }
  });
};
