const cron = require("node-cron");
const axios = require("axios");

exports.task = cron.schedule(
  "*/30 * * * * *",
  async () => {
    try {
      let id = 0;
      let response;
      do {
        id += 1;
        try {
          response = await axios.get(
            `http://localhost:3000/users/get-user-by-id/${id}`
          );
          if (response.status == 200) {
            console.log("API request successful:", response.data);
          }
        } catch (error) {
          console.error("Error making API request:", error.message);
        }
      } while (response.status === 200 && id <= 50);
    } catch (err) {
      console.error("Error:", err);
    }
  },
  {
    scheduled: true,
  }
);
