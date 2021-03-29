

exports.getImageurl = getImageurl;

var gis = require('g-i-s');

async function getImageurlPromise(searchTerm){
  return new Promise((resolve,reject) => {
    var imgurl = null;

    var opts = {
        searchTerm: searchTerm,
        queryStringAddition: '&safe=active&tbs=isz:i,ift:jpg'
      }

     gis(opts, logResults);

     function logResults(error, results) {
        if (error) {
          console.log(error);
          reject(error);
        }
        else {
          //console.log(results[0]);
          imgurl = results[0];
          resolve(imgurl);
        }
    }
  })
}


  async function getImageurl(searchTerm){
    await getImageurlPromise(searchTerm).then((message)=> {
      console.log(message);
      return message;
    }).catch((error)=> {
      console.log(error);
    })


}
