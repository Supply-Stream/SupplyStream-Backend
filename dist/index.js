const express = require("express");
require("dotenv").config();
const app = express();
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.listen(process.env.PORT, () => {
    console.log("Server is running on port 3001");
});
//# sourceMappingURL=index.js.map