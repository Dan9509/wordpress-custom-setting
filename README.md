# Play ground Gulp!

## install

```shell
git clone https://github.com/Hansanghyeon/playground-gulp.git
```

1. 프로젝트이름을 알아볼수있는 짧은 이름으로 폴더이름 변경
2. `cd 프로젝트/Gulp`
3. `sudo npm i`
4. .env 셋팅
    ```env
    # PROEJCT 정보
    PROJECT=프로젝트명
    OPTION_S3=boolean
    OPTION_SLACK_MESSAGE=boolean
    OPTION_SLACK_UPLOAD=boolean
    
    # AWS S3
    AWS_S3_BUCKET_NAME=
    AWS_S3_BUCKET_ACCESSKEYID=
    AWS_S3_BUCKET_SECRETACCESSKEY=
    # AWS_S3_URL/프로젝트명/output
    AWS_S3_URL=해당버킷 접근 루트 URL
    
    # Slack
    # CDN_URL 웹훅 유저 프로필 아이콘제공
    CDN_URL=https://cdn.4log.dev/
    SLACK_WEBHOOK=
    # error log file upload bot!
    # upload channel
    SLACK_API_GULPBOT=
    SLACK_CHANNEL=
    ```

### 기본셋팅 패키지목록

- Gulp
- SASS : 스타일작업
- Babel : ES6, ES7 → ES5
- TypeScript
- Slack
- AWS S3

---

Folder 설명

#### code

실제로 작업하는 곳 scss, js, ts ...

#### Gulp

손대지 않아도되는곳

#### public

S3 upload를 하지 않을시 여기서 최종결과물을 가져다 쓰면된다.