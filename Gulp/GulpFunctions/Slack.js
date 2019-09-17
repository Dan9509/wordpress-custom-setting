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
const MessageContent = (gulpError, username) => {
  let article = {
    iconUrl: process.env.CDN_URL,
    content: '```shell'+gulpError.message+'```',
    contentTitle: `에러발생 | ${username}`,
    messageSidebarColor: ''
  };

  switch (username) {
    case 'SassMax':
      article.iconUrl += 'icons/sass.png';
      article.messageSidebarColor = '#ec407a';
      break;
    case 'SassMin':
      article.iconUrl += 'icons/sass.png';
      article.messageSidebarColor = '#ec407a';
      break;
    case 'Babel':
      article.iconUrl += 'icons/babel.png';
      article.messageSidebarColor = '#fdd835';
      break;
    case 'Typescript':
      article.iconUrl += 'icons/typescript.png';
      article.messageSidebarColor = '#0288d1';
      break;
    case 'S3':
      article.iconUrl += 'icons/s3.png';
      article.messageSidebarColor = '#d96735';
      break;
    case 'Gulp':
      article.iconUrl += 'icons/gulp.png';
      article.messageSidebarColor = '#ca514e';
      break;
    case 'Node':
      article.iconUrl += 'icons/Node.png';
      article.messageSidebarColor = '#79a270';
      break;
    default:
      article.iconUrl = '';
      break;
  }

  return article;
};


const SlackNotice = (username, channel, iconUrl) => (
  require("gulp-slack")({
    url: process.env.SLACK_WEBHOOK,
    user: username,
    icon_url: iconUrl,
    channel: channel !== undefined ? channel : ''
  })
);

// Slack Webhook message content
const NoticeContent = (Message) => ([
  {
    text: process.env.PROJECT+'\n---',
    color: Message.messageSidebarColor,
    fields: [
      {
        title: Message.contentTitle,
        value: Message.content
      }
    ]
  }
]);

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
        let Message = MessageContent(gulpError, username);
        SlackNotice(username, '', Message.iconUrl)(NoticeContent(Message));
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