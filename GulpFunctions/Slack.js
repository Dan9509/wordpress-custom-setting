require('dotenv').config();

const SlackNotice = (user, channel) => {
  let iconUrl = '';
  if(user !== undefined) {
    switch(user) {
      case 'Sass':
        iconUrl = process.env.CDN_URL+'icons/sass.png';
        break;
      case 'Babel':
        iconUrl = process.env.CDN_URL+'icons/babel.png';
        break;
      case 'Typescript':
        iconUrl = process.env.CDN_URL+'icons/typescript.png';
        break;
      case 'S3':
        iconUrl = process.env.CDN_URL+'icons/s3.png';
        break;
      default:
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