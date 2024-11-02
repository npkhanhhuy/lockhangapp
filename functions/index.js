/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.sendAdvanceRequestNotification = functions.firestore
    .document("advances/{userId}")
    .onUpdate(async (change, context) => {
      const {advances} = change.after.data();
      const newAdvance = advances[advances.length - 1];

      // Lấy FCM token của người dùng từ Firestore
      const userSnapshot = await admin
          .firestore()
          .collection("USERS")
          .doc(context.params.userId)
          .get();
      const fcmToken = userSnapshot.data().fcmToken;

      if (fcmToken) {
        const message = {
          notification: {
            title: "Yêu cầu ứng tiền mới",
            body: `Yêu cầu ${newAdvance.amount} VND cho lý do: ${newAdvance.reason}`,
          },
          token: fcmToken,
        };

        // Gửi thông báo qua FCM
        return admin.messaging().send(message);
      } else {
        console.log("FCM token không tìm thấy");
        return null;
      }
    });
