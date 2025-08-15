const fetch = require("node-fetch");

exports.handler = async (event) => {
  const { token, title, body } = JSON.parse(event.body);

  if (!token || !title || !body) {
    return { statusCode: 400, body: "Missing required fields" };
  }

  const fcmServerKey = process.env.FCM_SERVER_KEY;
  if (!fcmServerKey) {
    return { statusCode: 500, body: "FCM server key not set" };
  }

  try {
    const response = await fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        "Authorization": `key=${fcmServerKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        notification: { title, body },
        to: token
      })
    });

    const data = await response.json();
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
