const cron = require('node-cron');
const axios = require('axios');
const xlsx = require('xlsx');
//const path = require('path');

const uploadDir = '/node_js/Novastrid-NodeJS-sandbox/APIs/myapp/excel-download/users.xlsx';

//cron.schedule('*/60 * * * * *', async () => {
cron.schedule('0 0 0 * * *', async () => {
    try {
        let response;
        //do{
            try{
                response = await axios.get(`http://localhost:3000/users/get-allusers`);
                if(response.status === 200){
                    
                    const workbook = xlsx.read(uploadDir);

                    const new_ids = [];
                    const need_to_add = [];
                    let updated_data = [];

                    if(workbook.SheetNames.includes("users")){
                        const worksheet = workbook.Sheets["users"];
                    
                        const data = xlsx.utils.sheet_to_json(worksheet);

                        const sql_user_ids = response.data.map(user_item => user_item.user_id);
                        const excel_user_ids = data.map(user_item => user_item.user_id);

                        new_ids.concat(sql_user_ids.filter(value => !excel_user_ids.includes(value)));
                        
                        need_to_add.concat(data.map(user_item => new_ids.includes(user_item.user_id)));

                        updated_data = [...data, ...need_to_add];
                        const updated_worksheet = xlsx.utils.json_to_sheet(updated_data);
                        workbook.Sheets['users'] = updated_worksheet;
                        
                    }
                    else{
                        updated_data = response.data;
                        const updated_worksheet = xlsx.utils.json_to_sheet(updated_data);
                        xlsx.utils.book_append_sheet(workbook, updated_worksheet, 'users');
                    }

                    xlsx.writeFile(workbook, uploadDir);
                    
                    console.log(`updated successfully ${uploadDir}`)
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
