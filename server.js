const express = require("express");
const validUrl = require("valid-url");
const jsSHA = require("jssha");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Urls = require("./models/Url");
const { ShortingFacade } = require("./ShortingFacade");
const {HashFactory} = require("./HashFactory");

mongoose
  .connect("mongodb://localhost/urlShorter")
  .then(() => console.log("db connected"))
  .catch((err) => console.log(err));

const app = express();
app.use(bodyParser.json());


app.get("/:hash", async (req, res) => {
  const { hash } = req.params;
  const shortingFacade = new ShortingFacade();
  const result = await shortingFacade.findHash(hash);
  res.send(result.orginalUrl);
});
app.post("/", async (req, res) => {
  const { originUrl } = req.body;

  if (validUrl.isUri(originUrl)) {

    const hashFactory = new HashFactory();
    const shaObj = hashFactory.create("CSHAKE128");
    const hash = shaObj.generate(originUrl)
    console.log(hash);

    const queryFacade = new ShortingFacade();
    queryFacade.createUrl(originUrl, hash);
    res.send(hash);
  } else {
    console.log("Not a URI");
    res.send("invalid url");
  }
});


app.listen(8080, () => {
  console.log("server stated on 8080");
});
