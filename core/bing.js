const superagent = require("superagent");
// const cheerio = require("cheerio");
const fs = require('mz/fs');

const headerInfo = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
};

const url = 'http://cn.bing.com';

module.exports = {
  getBackground: async function (ctx) {
    return await getImageURL();
  },

  getBackgroundBuffer: async function (ctx) {
    // save image to server disk
    let imageURL = await getImageURL();
    let today = new Date().toLocaleDateString();
    let imageName = imageURL.substr(imageURL.lastIndexOf('/') + 1);
    let imagePath = `./logs/${today}_${imageName}`;
    try {
      superagent.get(imageURL).pipe(fs.createWriteStream(imagePath));
    } catch (err) {
      console.log(err);
    }

    // if the url has not been saved, save it to json file
    let jsonData = JSON.parse(await fs.readFile(`./logs/imageURL.json`));
    if (jsonData.images.indexOf(imageURL) == -1) {
      jsonData.images.push(imageURL);
      await fs.writeFile('./logs/imageURL.json', JSON.stringify(jsonData));
    }

    // binary response data is in res.body as a buffer
    return (await sendGet(imageURL)).body;
  }
}

// Send request to bing and parse image url in web page
async function getImageURL() {
  let returnPage = (await sendGet(url)).text;
  let images = returnPage.match(/\/az\/hprichbg\/rb\/(.){1,50}_1920x1080\.jpg/g);// regular expression
  console.log(`${new Date().toLocaleString()}:${images}`);
  // let $ = cheerio.load(returnPage);
  // console.log($("#bgDiv").text());
  let imageURL = `https://cn.bing.com${images[0]}`; // here must be https
  return imageURL;
}

// Get target content using superagent
function sendGet(target) {
  return new Promise((resolve, reject) => {
    try {
      superagent.get(target).set(headerInfo)
        .end(function (err, res) {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
    } catch (err) {
      reject(err);
    }
  })
}