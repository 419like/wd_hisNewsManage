
var FtpDeploy = require('ftp-deploy');
var ftpDeploy = new FtpDeploy();
var path = require('path')
var distPath = path.resolve(__dirname, '..')+'/dist';
var config = {
  host:'192.168.2.9',
  username:'administrator',
  password:'123',
  port: 21,
  localRoot: distPath,
  remoteRoot: "/news",
  // include: ['build/version.txt'],
  // exclude: ['.git', '.idea', 'tmp/*', 'build/*']
}
  
ftpDeploy.deploy(config, function(err) {
  if (err) console.log(err)
  else console.log('finished');
});