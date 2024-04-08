const cron = require('node-cron');
const axios = require('axios');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'insu041831@gmail.com',
        pass: 'INSU0418'
    }
});

cron.schedule('*/60 * * * * *', async () => {
    try {
        let response;
        //do{
            try{
                response = await axios.get(`http://localhost:3000/users/get-allusers`);
                if(response.status === 200){
                    
                    const mailOptions = {
                        from: 'insu041831@gmail.com',
                        to: 'prabakaraninba0@gmail.com',
                        //subject: 'Daily Report',
                        subject: 'hai',
                        //text: `This is your daily report email.\n ${response.data}`
                        text: `This is a love message from ur secret lover`
                    };
                
                    const {error, info} = await transporter.sendMail(mailOptions)
                
                    if (error) {
                        console.error('Error sending email:', error);
                    } else {
                        console.log('Email sent:', info.response);
                    }
                
                }
            }
            catch (error) {
                console.error('Error making API request:', error.message);
            }
            
        //}while(response.status === 200 && id<=50);
        
    } catch (err) {
        console.error('Error:', err);
    }
}, {
    scheduled: true, 
});
