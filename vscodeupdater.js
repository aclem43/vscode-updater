const https = require('https');
const { execSync } = require('child_process');

const url = 'https://code.visualstudio.com/sha/download?build=stable&os=win32-x64-archive'
let downloadurl;

const fileVersion = async (fileurl) =>{
  let command = `${fileurl}\\bin\\code.cmd "-v"`;
  let out = execSync(command);

  out = out.toString();
  return out;
  
  
}


const httpget = (url) => {
  return new Promise(function(resolve, reject) {
      var req = https.get(url, function(res) {
        if (res.statusCode != 302) {reject()}
        else {resolve(res)}
      });
      // on request error, reject
      // if there's post data, write it to the request
      // important: end the request req.end()
  });
}

const main = async () => {
  console.log(await parse_version())
}

const get_current_vscode_version = async () => {
  const locatiourl = await httpget(url)
  downloadurl = locatiourl
  let ver = locatiourl.headers.location.match(/x64-([0-9\.]+).zip/)
  if (ver){
    ver = ver[1];
    return ver;
  }
  
  return null;
    
}

const get_file_vscode_version = async () => {
  const cmdresp = await fileVersion("C:\\Users\\Alexi\\Documents\\Programing\\Code\\VueChat\\VSCode");
  const ver = cmdresp.split('\n')[0];
  return ver
}

const parse_version = async () => {
  if (await get_current_vscode_version() == await get_file_vscode_version()){
    return true
  }  
}


main()

