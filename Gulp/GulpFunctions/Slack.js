require('dotenv').config();
const
  fs = require('fs'),
  path = require('path'),
  SlackUpload = require('gulp-slack-upload'),
  gutil = require('gutil'),
  chalk = require('chalk');

// --------------- 구분선 ---------------

const isOPTION = {
  message: process.env.OPTION_SLACK_MESSAGE === 'true',
  upload: process.env.OPTION_SLACK_UPLOAD === 'true'
};

// Slack message setting
let MessageContent = (message, messageType, username) => {
  let isCodeMsg = messageType === 'code';
  let ErrorContent = {
    title: `에러발생 | ${username}`,
    value: `\`\`\`shell ${message.message}\`\`\``
  };
  let S3uploadState = {
    title: 'S3 Upload',
    value: message
  };

  let msg = {
    iconUrl: process.env.CDN_URL,
    pushData: [{
      text: process.env.PROJECT+'\n---',
      color: '',
      fields: [ isCodeMsg ? ErrorContent : S3uploadState ]
    }]
  };

  switch (username) {
    case 'SassMix':
      msg.iconUrl += 'icons/sass.png';
      msg.pushData.color = '#ec407a';
      break;
    case 'SassMin':
      msg.iconUrl += 'icons/sass.png';
      msg.pushData.color = '#ec407a';
      break;
    case 'Babel':
      msg.iconUrl += 'icons/babel.png';
      msg.pushData.color = '#fdd835';
      break;
    case 'Typescript':
      msg.iconUrl += 'icons/typescript.png';
      msg.pushData.color = '#0288d1';
      break;
    case 'S3':
      msg.iconUrl += 'icons/s3.png';
      msg.pushData.color = '#d96735';
      break;
    case 'Gulp':
      msg.iconUrl += 'icons/gulp.png';
      msg.pushData.color = '#ca514e';
      break;
    case 'Node':
      msg.iconUrl += 'icons/Node.png';
      msg.pushData.color = '#79a270';
      break;
    default:
      msg.iconUrl = '';
      break;
  }

  return msg;
};


const SlackNotice = (username, channel, iconUrl) => (
  require("gulp-slack")({
    url: process.env.SLACK_WEBHOOK,
    user: username,
    icon_url: iconUrl,
    channel: channel !== undefined ? channel : ''
  })
);

// Slack Upload function
const UploadOptions = (username) => ({
  file: fs.createReadStream(path.join(__dirname, '..', 'log', `${username}.log`)),
  filetype: 'shell',
  title: `${username}`,
  initialComment: `${username}.log`,
  channels: process.env.SLACK_CHANNEL,
});

// output slack work flow
const GulpSlack = (gulpError, username) => {
  const logPath = path.join(__dirname, '..', 'log', `${username}.log`);
  console.log(logPath);
  return new Promise(resolve => {
    fs.writeFile(
      // Error log 작성
      logPath,
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
    // Slack upload & Message !!
    .then(() => {
      if(isOPTION.upload)
        SlackUpload(process.env.SLACK_API_GULPBOT,UploadOptions(username));
      else if(isOPTION.message) {
        let Message = MessageContent(gulpError, 'code', username);
        SlackNotice(username, '', Message.iconUrl)(Message.pushData);
      }
    })
    // Log file delete
    .then(() => {
      if(isOPTION.upload && isOPTION.message) {
        fs.unlink(logPath, err => {
          err === null ?
            gutil.log(chalk.green('Success (gulp-slack-upload): Deleted')) :
            gutil.log(chalk.red('Error deleteFile: ', err));
        })
      }
    })
    .catch(err => {
      console.log(err);
    })
};

// --------------- 구분선 ---------------


exports.GulpSlack = GulpSlack;