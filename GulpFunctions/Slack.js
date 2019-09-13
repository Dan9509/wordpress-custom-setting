require('dotenv').config();
const
  fs = require('fs'),
  SlackUpload = require('gulp-slack-upload'),
  gutil = require('gutil'),
  chalk = require('chalk');

// --------------- 구분선 ---------------


const SlackNotice = (user, channel) => {
  let iconUrl = process.env.CDN_URL;
  if(user !== undefined) {
    switch(user) {
      case 'Sass':
        iconUrl += 'icons/sass.png';
        break;
      case 'Babel':
        iconUrl += 'icons/babel.png';
        break;
      case 'Typescript':
        iconUrl += 'icons/typescript.png';
        break;
      case 'S3':
        iconUrl += 'icons/s3.png';
        break;
      case 'Gulp':
        iconUrl += 'icons/gulp.png';
        break;
      case 'Node':
        iconUrl += 'icons/Node.png';
        break;
      default:
        iconUrl = '';
        break;
    }
  }

  return require("gulp-slack")({
    url: process.env.SLACK_WEBHOOK,
    user: user,
    icon_url: iconUrl,
    channel: channel !== undefined ? channel : ''
  });
};

// Slack Webhook message content
const NoticeContent = (content, contentTitle, messageSidebarColor) => ([
  {
    text: process.env.PROJECT,
    color: messageSidebarColor,
    fields: [
      {
        title: contentTitle,
        value: content
      }
    ]
  }
]);

// Slack Upload function
const UploadOptions = (user) => ({
  file: fs.createReadStream(`${__dirname}/${user}.log`),
  filetype: 'shell',
  title: `${user}.log`,
  initialComment: `${user}`,
  channels: process.env.SLACK_CHANNEL,
});

// output slack work flow
const GulpSlack = (gulpError, username) => (
  new Promise(resolve => {
    fs.writeFile(
      // Error log 작성
      `${__dirname}/${username}.log`,
      // Error 내용
      gulpError.message,
      // 오류 콜백
      err => {
        if(err !== null && err !== undefined) {
          console.log(err.message);
        } else {
          resolve();
        }
      }
    );

  })
    // Slack upload!!
    .then(() => {
      SlackUpload(process.env.SLACK_API_GULPBOT,UploadOptions(username))
    })
    // Log file delete
    .then(() => {
      fs.unlink(`${__dirname}/${username}.log`, err => {
        err === null ?
          gutil.log(chalk.green('Success (gulp-slack-upload): Deleted')) :
          gutil.log(chalk.red('Error deleteFile: ', err));
      })
    })
    .catch(err => {
      console.log(err);
    })
);

// --------------- 구분선 ---------------


exports.GulpSlack = GulpSlack;