const { nanoid } = require("nanoid");
const Url = require("../models/URLModel");
const urlValidate = require("../utils/urlValidate");

const router = require("express").Router();

router.post("/short", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(403).json("Authentication failed!");
    }
    if (token !== process.env.API_SECRET_KEY) {
      return res.status(404).json("UnAuthorized Request!");
    }
  } catch (e) {
    console.log(e);
    return res.status(403).json("Authentication failed!");
  }
  const { origUrl } = req.body;
  const base = process.env.BASE;

  const urlId = nanoid();
  if (urlValidate(origUrl)) {
    try {
      let url = await Url.findOne({ origUrl });
      if (url) {
        res.status(201).json(url);
      } else {
        const shortUrl = `${base}/${urlId}`;

        url = new Url({
          origUrl,
          shortUrl,
          urlId,
          date: new Date(),
        });

        await url.save();
        res.status(201).json(url);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json("Server Error");
    }
  } else {
    res.status(400).json("Invalid Original Url");
  }
});

module.exports = router;
