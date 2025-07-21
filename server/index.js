const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 5001;

app.use(cors());
app.use("/csv", express.static(path.join(__dirname, "../hdb")));

app.listen(PORT, () => {
  console.log(`CSV Server running at http://localhost:${PORT}`);
});
