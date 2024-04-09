var task_get_by_id = require('../../corn_job/corn_job_for_users_by_id');
var task_daily_update = require('../../corn_job/corn_job_for_users_day_update');
var task_send_email = require('../../corn_job/corn_job_for_sending_mails');
var task_send_email_template = require('../../corn_job/corn_job_for_sending_mails_with_templete');

task_get_by_id.start();

// setTimeout(() => {
//     task_get_by_id.stop();
//     console.log('Cron job for getting the id details has been stopped.');
// }, 500000);


task_daily_update.start();
task_send_email.start();
task_send_email_template.start();
