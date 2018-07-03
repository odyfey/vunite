# Deploy guide

## Discourse

[Cloud install guide](https://github.com/discourse/discourse/blob/master/docs/INSTALL-cloud.md)

Also you can use vagrant on the local machine:  
Section "Developing with Vagrant" on the page: https://github.com/discourse/discourse_docker

## Discourse settings

Сonfigured in the admin panel:
+ enable sso provider = check enable
+ sso secret = YOUR_UNIQUE_SSO_SECRET
+ cors origins = http://localhost:8080, http://localhost:8888 (developer hosts)
+ allowed user api auth redirects = http://localhost:8080 (developer host)
+ tagging enabled = check enable

## http-bypass

Should be launched

[Installation and configuration guide](https://github.com/Rokid/node-http-bypass)

## discourse sso provider

“Using Discourse as SSO provider” implementation: https://github.com/zullin/DiscourseSso

More info: https://meta.discourse.org/t/using-discourse-as-a-sso-provider/32974

## vunite

+ npm install
+ development: npm run serve
+ production: npm run build
