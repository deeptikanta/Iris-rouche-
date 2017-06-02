"use strict";
var express = require('express');
var bodyParser = require('body-parser');
    var textract = require('textract');
      var parse = require('csv-parse');
       var WordExtractor = require("word-extractor");
       var officegen = require('officegen');

var app = express();
    var fs = require('fs');
console.log('show current path...',__dirname);
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/app'));
app.post('/app/test12', function (req, res) {

    //var fs = require('fs');
    fs.writeFile('message.bat', req.body[Object.keys(req.body)], function (err) {
        if (err) throw err;

    });
    test();
});

app.post('/app/test123', function (req, res) {
   // var fs = require('fs');


    fs.readFile(__dirname + '/MainSuit/' + req.body.data, 'utf8', function (err, data) {
        console.log(__dirname + '/MainSuit/' + req.body.data);
        res.send(data);

    });
});
app.post('/app/delete', function (req, res) {

  //  var fs = require('fs');
    var downloadedpath = req.body.downloadedpath;
    var path = req.body.path;
    fs.unlinkSync(path);
    fs.createReadStream(downloadedpath).pipe(fs.createWriteStream(path));
    fs.unlinkSync(downloadedpath);
    console.log('successfully deleted file and uploaded');

});
app.post('/app/csvcovert', function (req, res) {

   // var fs = require('fs');
  

    var csvData = [];
    console.log(req.body.path)
    fs.readFile(req.body.path, 'utf8', function (err, data) {
        console.log(data);
        //res.send(data);


        if (data.search(",") == -1) {
            fs.createReadStream(req.body.path)
                .pipe(parse({ delimiter: ';' }))
                .on('data', function (csvrow) {
                    //console.log(csvrow);
                    //do something with csvrow
                    csvData.push(csvrow);
                })
                .on('end', function () {
                    //do something wiht csvData


                    res.send(csvData);
                });
        }
        else {
            fs.createReadStream(req.body.path)
                .pipe(parse({ delimiter: ',' }))
                .on('data', function (csvrow) {
                    //console.log(csvrow);
                    //do something with csvrow
                    csvData.push(csvrow);
                })
                .on('end', function () {
                    //do something wiht csvData


                    res.send(csvData);
                });
        }
    });


});

app.get('/MainSuit', function (req, res) {
    //var fs = require('fs');

    fs.readdir(__dirname + '/MainSuit', function (err, files) {

        files.forEach(function (f) {


        });

        res.send(files);
    });


});
app.get('/Automation_Log', function (req, res) {
  

    fs.readdir(__dirname + '/Automation_Log', function (err, files) {
        files.forEach(function (f) {
        });

        res.send(files);
    });
});
app.get('/ProjectReports', function (req, res) {


    fs.readdir(__dirname + '/Reports', function (err, files) {
        files.forEach(function (f) {
        });
console.log(files);
        res.send(files);
    });
});
app.post('/app/folder', function (req, res) {
 
    
     console.log(__dirname  + req.body.pathfile,"---------------");
    fs.readdir(__dirname  + req.body.pathfile, function (err, files) {
        console.log(files);
        if (files==undefined) {
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
app.post('/app/back', function (req, res) {
 
    
    console.log(__dirname + req.body.backpath);
    fs.readdir(__dirname + req.body.backpath, function (err, files) {
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
   // var fs = require('fs');
    console.log(req.body.pathfile);
    fs.readFile(__dirname + req.body.pathfile, function (err, content) {
        console.log("inside image directory");
        if (err) {
            res.status(400, { 'Content-type': 'text/html' })
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
app.post('/app/folderhtml', function (req, res) {
   // var fs = require('fs');
    console.log(req.body.pathfile);
    fs.readFile(__dirname + req.body.pathfile, function (err, content) {
        console.log("inside html directory");
        if (err) {
            res.status(400, { 'Content-type': 'text/html' })
            console.log(err);
            res.end("No such html");
        } else {

            res.send(content);

        }
    });

});
app.post('/app/folderdoc', function (req, res) {
    //var WordExtractor = require("word-extractor");
    var extractor = new WordExtractor();

    var extracted = extractor.extract(__dirname + req.body.pathfile);
    extracted.then(function (doc) {
        console.log(doc.getBody());
        res.send(doc.getBody());
    });

});
app.post('/app/folderdocx', function (req, res) {

    console.log(__dirname + req.body.pathfile);
    
// fs.readFile(__dirname  + req.body.pathfile, function (err, content) {

// //   textract.fromFileWithPath(__dirname + '/Automation_Log/' + req.body.pathfile, function( error, text ) {
// //      res.send(text);
// //   })
// console.log(content);
// res.send(content);
// });
textract.fromFileWithPath(__dirname + req.body.pathfile, function( error, text ) {
      res.send(text);
   })

});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
})



function test() {
    // The path to the .bat file
   // var fs = require('fs');
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



//pdf reader

app.post('/app/folderpdf', function (req, res) {
   // var fs = require('fs');
    console.log(req.body.pathfile);
    fs.readFile(__dirname + req.body.pathfile, function (err, content) {
        console.log("inside pdf directory");
        if (err) {
            res.send(400, { 'Content-type': 'text/html' })
            console.log(err);
            res.end("No such image");
        } else {
            var base64Image = content.toString('base64');

            res.setHeader("Content-Disposition", "inline");
            res.send(base64Image);

        }
    });
});




///project Reports------------------------->>>>>>>>>>>>>>>>>>>

app.post('/app/Reportfolderpdf', function (req, res) {
   // var fs = require('fs');
    console.log(req.body.pathfile);
    fs.readFile(__dirname + req.body.pathfile, function (err, content) {
        console.log("inside pdf directory");
        if (err) {
            res.send(400, { 'Content-type': 'text/html' })
            console.log(err);
            res.end("No such image");
        } else {
            var base64Image = content.toString('base64');

            res.setHeader("Content-Disposition", "inline");
            res.send(base64Image);

        }
    });
});
app.post('/app/Reportfolderhtml', function (req, res) {
   // var fs = require('fs');
    console.log(__dirname + req.body.pathfile);
    fs.readFile(__dirname + req.body.pathfile, function (err, content) {
        console.log("inside folder html directory");
        if (err) {
            res.status(400, { 'Content-type': 'text/html' })
            console.log(err);
            res.end("No such html");
        } else {

            res.send(content);

        }
    });

});
app.post('/app/Reportfolderdocx', function (req, res) {

    console.log(__dirname  + req.body.pathfile);
    
fs.readFile(__dirname  + req.body.pathfile, function (err, content) {

//   textract.fromFileWithPath(__dirname + '/Automation_Log/' + req.body.pathfile, function( error, text ) {
//      res.send(text);
//   })
console.log(content);
res.send(content);
});


});
app.post('/app/Reportfolderdoc', function (req, res) {
    //var WordExtractor = require("word-extractor");
    var extractor = new WordExtractor();

    var extracted = extractor.extract(__dirname + req.body.pathfile);
    extracted.then(function (doc) {
        console.log(doc.getBody());
        res.send(doc.getBody());
    });

});
app.post('/app/Reportfolderimage', function (req, res) {
   // var fs = require('fs');
    console.log(req.body.pathfile);
    fs.readFile(__dirname  + req.body.pathfile, function (err, content) {
        console.log("inside image directory");
        if (err) {
            res.status(400, { 'Content-type': 'text/html' })
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
app.post('/app/Reportfolder', function (req, res) {
 
    
    console.log(req.body.pathfile);
    fs.readdir(__dirname + req.body.pathfile, function (err, files) {
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