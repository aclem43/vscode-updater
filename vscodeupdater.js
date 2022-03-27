const https = require('https');
const fs = require('fs');
const zlib = require('zlib');
const { execSync } = require('child_process');

const url = 'https://code.visualstudio.com/sha/download?build=stable&os=win32-x64-archive'
var downloadurl;

const fileVersion = async (fileurl) =>{
  let command = `${fileurl}\\bin\\code.cmd "-v"`;
  let out = execSync(command);

  out = out.toString();
  return out;
  
  
}

const download = async (url, dest) => {
  console.log("Beginning Download");
  var file = fs.createWriteStream(dest);
  
  return new Promise((resolve,reject)=>{

    https.get(url, function(response) {
      response.pipe(file);

      file.on('finish', function() {
        file.close();
        resolve()
        
      });
      file.on('error',(err)=>{
        console.error(err)
        reject()
      })
    });
  })
  

}

const httpsget = (url) => {
  return new Promise((resolve, reject) => {
      let req = https.get(url, (res) => {
        if (res.statusCode != 302) {reject()}
        else {resolve(res)}
        
      });
      // on request error, reject
      // if there's post data, write it to the request
      // important: end the request req.end()
  });
}


const get_current_vscode_version = async () => {
  const locatiourl = await httpsget(url)
  downloadurl =  locatiourl.headers.location
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

const main = async () => {
  if (await parse_version()) {
    await download(downloadurl,"./VscodeUpdate.zip")
   
    console.log("Download Complete")
  }
}

main()

