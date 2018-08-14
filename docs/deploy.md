# Deploy guide

## Discourse

[Cloud install guide](https://github.com/discourse/discourse/blob/master/docs/INSTALL-cloud.md)

Also you can use vagrant on the local machine:  
Section "Developing with Vagrant" on the page: https://github.com/discourse/discourse_docker

## Discourse settings

Add the following environment variable in app.yml file:

```
DISCOURSE_ENABLE_CORS: true
```

Сonfigured in the admin panel:

-   enable sso provider = check enable
-   sso secret = YOUR_UNIQUE_SSO_SECRET
-   cors origins = http://localhost:8080 (developer host)
-   allowed user api auth redirects = http://localhost:8080 (developer host)
-   tagging enabled = check enable

## discourse sso provider

“Using Discourse as SSO provider” implementation: https://github.com/zullin/DiscourseSso

More info: https://meta.discourse.org/t/using-discourse-as-a-sso-provider/32974

## vunite

-   npm install
-   development: npm run serve
-   production: npm run build
