const cron = require('node-cron');
const axios = require('axios');
const nodemailer = require('nodemailer');
//service: 'gmail',

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'insu041831@gmail.com',
      pass: 'ialw aubx wzlp nmuy'
    }
});

exports.task = cron.schedule('*/60 * * * * *', async () => {
    try {
        try{
            const response = await axios.get(`http://localhost:3000/users/get-allusers`);
            if(response.status === 200){
                
                const mailOptions = {
                    from: 'insu041831@gmail.com',
                    to: 'prabakaraninba0@gmail.com',
                    subject: 'Daily Report',
                    //subject: 'I LOVE YOU',
                    text: `This is your daily report email.\n ${JSON.stringify(response.data, null, 2)}`
                    //text: `This is a love message from ur secret lover`
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


