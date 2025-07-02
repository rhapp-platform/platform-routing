alias d:= deploy
alias g:=gitp
alias b:=build

rhappappZoneID:="d9b23864005da27cf9a519ba2f428203"
apiToken:="nBBt7RK2x69I8p5J06s5Hz_AdluPwIqAH_FdqNeK"
email:="glenn@rhappsody.com"

deploy snippets:
    echo "deploy snippets"

build name:
    bun build src/{{name}}.ts --minify --outfile={{name}}.js

# git add/commit/push
gitp:
  git add .
  git commit -m "build"
  git push origin master


ls:
    curl --request GET https://api.cloudflare.com/client/v4/zones/{{rhappappZoneID}}/snippets \
    --header "Authorization: Bearer {{apiToken}}" \
    -H "X-Auth-Email: {{email}}" | jq

test-app ag an:
    curl -i https://{{ag}}.rhapp.app/{{an}}

test-app-sbs ag an:
    curl -i https://sb.rhap.cc/storage/v1/object/public/apps/{{ag}}/{{an}}/app.rha?ffffeeee

temp ag an file:
    rclone copyto {{file}} sbs:/apps/{{ag}}/{{an}}/{{file}}  --header-upload "Content-Type: application/x-rha-aidvalue-{{ag}}-{{an}}"
