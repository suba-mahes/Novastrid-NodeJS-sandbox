const cron = require('node-cron');
const axios = require('axios');

const ejs = require('ejs');
const fs = require('fs');

const transporter = require('./mail_login')
const template_path = "/node_js/Novastrid-NodeJS-sandbox/APIs/myapp/corn_job/template/email_template_html.ejs"

exports.task = cron.schedule('*/60 * * * * *', async () => {
//exports.task = cron.schedule('0 9 * * *', async () => {
    try {
        try{
            const response = await axios.get(`http://localhost:3000/users/get-allusers`);

            const data = {
                "name" : 'INBA',
                "name_1" : 'SUBA',
                "join" : 'INSU'
             }
            const email_template = fs.readFileSync(template_path, 'utf8');
            const compiled_template = ejs.compile(email_template);
            
            if(response.status === 200){
                
                const mailOptions = {
                    from: 'insu041831@gmail.com',
                    to: 'prabakaraninba0@gmail.com',
                    //subject: 'Daily Report',
                    //text: `This is your daily report email.\n ${JSON.stringify(response.data, null, 2)}`
                    // subject: 'I LOVE YOU',
                    // text: `This is a love message from ur secret lover`
                    subject: 'Message to my dear husband',
                    html: compiled_template(data)
                };
            
                await transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                    } else {
                        const result = info.response.split(' ');
                        console.log('Email sent:', result[2]);
                    }
                });
            }
        }
        catch (error) {
            console.error('Error making API request:', error.message);
        }        
    } catch (err) {
        console.error('Error:', err);
    }
}, {
    scheduled: true, 
});
