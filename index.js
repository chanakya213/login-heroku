const express = require("express");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {

    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;

    const data = {
        members: [{
            status: "subscribed",
            email_address: email,
            merge_fields: {
                FNAME: fname,
                LNAME: lname
            }
        }]
    }

    const jsonData = JSON.stringify(data);

    const options = {
        method: "POST",
        auth: "chanakya:bfaa1867761d4bde203d7f5e4069c974-us5"
    }

    const url = "https://us5.api.mailchimp.com/3.0/lists/724ff76ec3";

    const request = https.request(url, options, (response) => {

        if (response.error_count == 0 || response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/fail.html");
        };

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();

    app.post("/fail", (req, res) => {
        res.redirect("/");
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server started on port "3000".... ... .. .`);
});