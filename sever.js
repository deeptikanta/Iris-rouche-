"use strict";
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
//app.use(express.bodyParser());
//console.log(bodyParser);
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/app'));
app.post('/app/test12', function (req, res) {
   // console.log(Object.keys(req.body));
    //console.log(req.body[Object.keys(req.body)]);
  var fs = require('fs');
   fs.writeFile('message.bat', req.body[Object.keys(req.body)], function (err) {
        if (err) throw err;
       
    });
    test();
});

app.post('/app/test123', function (req, res) {

    

fs.readFile(__dirname + '/MainSuit/'+req.body.data, 'utf8', function(err, data) {  
   console.log(__dirname + '/MainSuit/'+req.body.data);
       res.send(data);
     
});
});
app.post('/app/delete', function (req, res) {

    var fs = require('fs');

var path="C:\\Users\\Dpanda\\Desktop\\New folder\\AppConfig.csv";
fs.unlinkSync(path);
fs.createReadStream('C:\\Users\\Dpanda\\Downloads\\AppConfig.csv').pipe(fs.createWriteStream('C:\\Users\\Dpanda\\Desktop\\New folder\\AppConfig.csv'));
var path1="C:\\Users\\Dpanda\\Downloads\\AppConfig.csv";
fs.unlinkSync(path1);
console.log('successfully deleted file and uploaded');

});

app.get('/MainSuit', function (req, res) {
   var fs = require('fs');
// fs.realpath(__dirname, function(err, path) {
//     if (err) {
//         console.log(err);
//      return;
//     }
//     console.log('Path is : ' + path);
// });
fs.readdir(__dirname + '/MainSuit', function(err, files) {
   
    files.forEach(function(f) {
        //console.log('Files: ' + f);
         
    });
   
    res.send(files);
});

  //res.send(files)
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
})


// app.post('/LEDon', function(req, res) {
//     console.log('LEDon button pressed!');
//     //app.listen(1337);
//    test();
//     // Run your LED toggling code here
// });
function test(){
// The path to the .bat file
  var fs = require('fs');
 var myBatFilePath ="C:\\Users\\Dpanda\\Desktop\\New folder\\message.bat"

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

    switch(code){
        case 0:
            console.info(preText+"Something unknown happened executing the batch.");
            fs.unlinkSync(myBatFilePath);
            break;
        case 1:
            console.info(preText+"The file already exists");
             fs.unlinkSync(myBatFilePath);
            break;
        case 2:
            console.info(preText+"The file doesn't exists and now is created");
             fs.unlinkSync(myBatFilePath);
            break;
        case 3:
            console.info(preText+"An error ocurred while creating the file");
             fs.unlinkSync(myBatFilePath);
            break;
    }
});
}
