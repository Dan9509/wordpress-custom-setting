# 리팩토링 & Slack ftp upload 기능추가

- ES6 문법으로 변경
- Gulp Function Modularization
    - S3
    - slack notice webhook
    - auto compile
        - Sass
        - Babel
        - Typescript
        - css autoprefixer
    - 기능추가
        - S3 upload state message FWD slack
        - Gulp error log file for Slack File upload
        - Auto Prefixer browser list setting!