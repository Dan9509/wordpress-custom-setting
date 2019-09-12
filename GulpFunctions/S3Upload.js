require('dotenv').config();
const awsPublish = require("gulp-awspublish"),
  rename = require("gulp-rename");

const publisher = awsPublish.create(
  {
    // 해당지역코드 서울 : 'ap-northeast-2'
    region: "ap-northeast-2",
    params: {
      Bucket: process.env.AWS_S3_BUCKET_NAME
    },
    accessKeyId: process.env.AWS_S3_BUCKET_ACCESSKEYID,
    secretAccessKey: process.env.AWS_S3_BUCKET_SECRETACCESSKEY
  }
  // TODO: 알아봐야하는 옵션
  // 정확하게 몰라서 적용하지 않음
  // {
  //     cacheFileName: "your-cache-location"
  // }
);

const S3Upload = (inputStream, filename) => {
  // upload info
  let headers = { "Cache-Control": "max-age=315360000, no-transform, public" };

  return (
    inputStream
    // s3 upload 하위폴더로 생성
      .pipe(
        rename(path => {
          path.dirname = process.env.PROJECT + "/" + filename + "/" + path.dirname;
        })
      )
      .pipe(publisher.publish(headers))
      // .pipe(s3.publisher.cache())
      .pipe(awsPublish.reporter())
  );
};


exports.S3Upload = S3Upload;