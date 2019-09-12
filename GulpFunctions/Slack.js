require('dotenv').config();

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

exports.SlackNotice = SlackNotice;
exports.NoticeContent = NoticeContent;