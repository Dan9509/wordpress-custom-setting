require('dotenv').config();
const
  fs = require('fs'),
  path = require('path'),
  SlackUpload = require('gulp-slack-upload'),
  gutil = require('gutil'),
  chalk = require('chalk');

// --------------- 구분선 ---------------

const isOPTION = {
  message: process.env.SLACK_MESSAGE === 'true',
  upload: process.env.SLACK_UPLOAD === 'true'
};

// Slack message setting
const SlackNotice = (username, Message, channel) => {
  let isCodeMsg = Message.Type === 'code';
  let ErrorContent = {
    title: `에러발생 | ${username}`,
    value: `\`\`\`shell ${Message.content}\`\`\``
  };
  let S3uploadState = {
    title: null,
    value: Message
  };

  let msg = {
    iconUrl: process.env.CDN_URL,
    pushData: [{
      text: process.env.PROJECT,
      color: '',
      fields: isCodeMsg ? [ ErrorContent ] : null
    }]
  };

  switch (username) {
    case 'SassMix':
      msg.iconUrl += 'icons/sass.png';
      msg.pushData[0].color = '#ec407a';
      break;
    case 'SassMin':
      msg.iconUrl += 'icons/sass.png';
      msg.pushData[0].color = '#ec407a';
      break;
    case 'Babel':
      msg.iconUrl += 'icons/babel.png';
      msg.pushData[0].color = '#fdd835';
      break;
    case 'Typescript':
      msg.iconUrl += 'icons/typescript.png';
      msg.pushData[0].color = '#0288d1';
      break;
    case 'S3':
      msg.iconUrl += 'icons/s3.png';
      msg.pushData[0].text = S3uploadState.value;
      msg.pushData[0].color = '#d96735';
      break;
    case 'Gulp':
      msg.iconUrl += 'icons/gulp.png';
      msg.pushData[0].color = '#ca514e';
      break;
    case 'Node':
      msg.iconUrl += 'icons/node.png';
      msg.pushData[0].color = '#79a270';
      break;
    case 'Webpack':
      msg.iconUrl += 'icons/webpack.png';
      msg.pushData[0].color = '#3874b5';
      break;
    default:
      msg.iconUrl = '';
      break;
  }

  return require("gulp-slack")({
    url: process.env.SLACK_WEBHOOK,
    user: username,
    icon_url: msg.iconUrl,
    channel: channel !== undefined ? channel : ''
  })(msg.pushData);
};

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
        // let Message = MessageContent(gulpError, 'code', username);
        let Message = {
          content: gulpError.message,
          Type: 'code',
          username
        };
        SlackNotice(username, Message);
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
exports.SlackMessage = SlackNotice;