const cron = require("node-cron");
const axios = require("axios");

const ejs = require("ejs");
const fs = require("fs");

const transporter = require("./mail_login");
const template_path =
  "/node_js/Novastrid-NodeJS-sandbox/APIs/myapp/corn_job/template/email_template_daily_update.ejs";

exports.task = cron.schedule(
  "*/60 * * * * *",
  async () => {
    //exports.task = cron.schedule('0 9 * * *', async () => {
    try {
      try {
        const response = await axios.get(
          `http://localhost:3000/users/get-allusers`
        );

        const email_template = fs.readFileSync(template_path, "utf8");
        const compiled_template = ejs.compile(email_template);

        if (response.status === 200) {
          const mailOptions = {
            from: "insu041831@gmail.com",
            to: "prabakaraninba0@gmail.com",
            subject: "Daily Report",
            html: compiled_template(response.data),
          };

          await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error("Error sending email:", error);
            } else {
              const result = info.response.split(" ");
              console.log("Email sent:", result[2]);
            }
          });
        }
      } catch (error) {
        console.error("Error making API request:", error.message);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  },
  {
    scheduled: true,
  }
);
