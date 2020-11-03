REM build server
call npx gulp --gulpfile server/gulpfile.js --releaseVersion %1

REM build client
cd client
call npm run build

REM build project
cd ..
call docker-compose build
