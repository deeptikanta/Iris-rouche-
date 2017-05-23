"use strict";
var express = require('express');
var bodyParser = require('body-parser');

var app = express();


app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/app'));
app.post('/app/test12', function (req, res) {

    var fs = require('fs');
    fs.writeFile('message.bat', req.body[Object.keys(req.body)], function (err) {
        if (err) throw err;

    });
    test();
});

app.post('/app/test123', function (req, res) {
    var fs = require('fs');


    fs.readFile(__dirname + '/MainSuit/' + req.body.data, 'utf8', function (err, data) {
        console.log(__dirname + '/MainSuit/' + req.body.data);
        res.send(data);

    });
});
app.post('/app/delete', function (req, res) {

    var fs = require('fs');
    var downloadedpath = req.body.downloadedpath;
    var path = req.body.path;
    fs.unlinkSync(path);
    fs.createReadStream(downloadedpath).pipe(fs.createWriteStream(path));
    fs.unlinkSync(downloadedpath);
    console.log('successfully deleted file and uploaded');

});

app.get('/MainSuit', function (req, res) {
    var fs = require('fs');

    fs.readdir(__dirname + '/MainSuit', function (err, files) {

        files.forEach(function (f) {


        });

        res.send(files);
    });


});
app.get('/Automation_Log', function (req, res) {
    var fs = require('fs');

    fs.readdir(__dirname + '/Automation_Log', function (err, files) {
        files.forEach(function (f) {
        });

        res.send(files);
    });
});
app.post('/app/folder', function (req, res) {
    var fs = require('fs');
    //console.log(req.body.data)
    console.log(req.body.pathfile);
        fs.readdir(__dirname + '/Automation_Log/' + req.body.pathfile, function (err, files) {
            console.log(files);
            if (files.length == 0) {
                var t = undefined;

                res.send(t);
            }
            else {
                files.forEach(function (f) {


                });
                res.send(files);
            }

        });
    
  


});
app.post('/app/folderimage', function (req, res) {
    var fs = require('fs');
     console.log(req.body.pathfile);
     fs.readFile(__dirname + '/Automation_Log/' + req.body.pathfile, function (err, content) {
            console.log("inside image directory");
            if (err) {
                res.send(400, { 'Content-type': 'text/html' })
                console.log(err);
                res.end("No such image");
            } else {
                var base64Image = content.toString('base64');
                res.send(base64Image);
                // res.writeHead(200,{ "Content-type": "application/pdf" });
                // res.write(content, "binary");
                // res.end();
              
            }
        });

});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
})



function test() {
    // The path to the .bat file
    var fs = require('fs');
    var myBatFilePath = "C:\\Users\\Dpanda\\Desktop\\New folder\\message.bat"

    const spawn = require('child_process').spawn;
    const bat = spawn('cmd.exe', ['/c', myBatFilePath]);


    // Handle normal output
    bat.stdout.on('data', (data) => {
        // As said before, convert the Uint8Array to a readable string.
        var str = String.fromCharCode.apply(null, data);
        console.info(str);
    });

    // Handle error output
    bat.stderr.on('data', (data) => {
        // As said before, convert the Uint8Array to a readable string.
        var str = String.fromCharCode.apply(null, data);
        console.error(str);
    });

    // Handle on exit event
    bat.on('exit', (code) => {
        var preText = `Child exited with code ${code} : `;

        switch (code) {
            case 0:
                console.info(preText + "Something unknown happened executing the batch.");
                fs.unlinkSync(myBatFilePath);
                break;
            case 1:
                console.info(preText + "The file already exists");
                fs.unlinkSync(myBatFilePath);
                break;
            case 2:
                console.info(preText + "The file doesn't exists and now is created");
                fs.unlinkSync(myBatFilePath);
                break;
            case 3:
                console.info(preText + "An error ocurred while creating the file");
                fs.unlinkSync(myBatFilePath);
                break;
        }
    });
}
