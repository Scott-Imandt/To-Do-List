

module.exports = getImageurl;

var gis = require('g-i-s');

async function getImageurlPromise(searchTerm){
  return new Promise((resolve,reject) => {
    var imgurl = null;

    // 2 options for gis search
    var opts = {
      // search term is name of search
        searchTerm: searchTerm,
        // custsom search addon to url to make a search
      // (safe search, size icon, result jpg (api states that there is a bug that result could be something else(I would offilter out later ))
        queryStringAddition: '&safe=active&tbs=isz:i,ift:jpg'
      }

//3 api function
     gis(opts, logResults);

     function logResults(error, results) {
        if (error) {
          console.log(error);
          // if result was error it would be .catch in main function
          reject(error);
        }
        else {
          //console.log(results[0]);
          //get first img url result
          imgurl = results[0];
          //4 send back  imgurl
          resolve(imgurl);
        }
    }
  })
}

// 1 async funtion getImageurl is called and waits for getImageurlPromise
  async function getImageurl(searchTerm){
    await getImageurlPromise(searchTerm).then((message)=> {
      //5 .then waitsfor message == imgurl and returns it
      console.log(message);
      //6 this process runs sepretly from app.js so im result is always pending and thus it cant be used
      // i tried waiting in app.js for getImageurl to run but i get return of undefined because the server runs past without waiting
      // app.js call on line 170 in app.js
      return message;
    }).catch((error)=> {
      console.log(error);
    })


}
