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
    - [x] Gulp error log file for Slack File upload  
        - [x] Sass
        - [ ] Babel
        - [ ] TypeScript
    - [ ] Slack webhook && error log upload toggle
    - [ ] S3 upload state message FWD slack
    - [ ] gulp plumber for Error handleing
    - [ ] Auto Prefixer browser list setting!
    
## SLACK OPTION 토글기능구현


### ERROR

Babel gulp error 출력문이 유니코드의 컬러값을 포함한 `err.message` 형태로나와서 log를 파일로업로드, 웹훅으로 메세지보내도 알아볼수없는 형태로 나온다. 이것에 해결방법을 찾아야함.

```shell
'/Users/sanghyeonhan/@Project/wp_develop_space/Babel/TEST.js: Unexpected token (5:7)\n\n\u001b[0m \u001b[90m 3 | \u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 4 | \u001b[39m\u001b[0m\n\u001b[0m\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 5 | \u001b[39m\u001b[33mTEST\u001b[39m()\u001b[33m;\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m   | \u001b[39m       \u001b[31m\u001b[1m^\u001b[22m\u001b[39m\u001b[0m',
  name: 'SyntaxError',
```

#### 해결

gulp-babel은 babel의 옵션을 .babelrc에서 적용되지않고 pipeline에서 gulp-babel의 옵션으로 적용해줘야지 babel 옵션이 적용된다.
