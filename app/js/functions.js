var passNumber;
var failNumber;
var noRunNumber;
var profile = [];
var data = [];
$(document).ready(function () {

    $("#thead").hide();
    $('#test').hide();
    $('#docdata').hide();

});

function getdatetime() {
    var currentdate = new Date();
    var datetime = "" + currentdate.getDate() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getFullYear() + "-" + currentdate.getHours() + "_" + currentdate.getMinutes() + "_" + currentdate.getSeconds();
    return datetime;
}


function openExcel(newpath) {
    var excel2 = new ActiveXObject("Excel.Application");
    excel2.visible = true;
    var excel_file = excel.Workbooks.Open(newpath);
    var excel_sheet = excel.Worksheets("Configuration");
    var data = excel_sheet.Cells(1, 1).Value;
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}


function copyfile(src, dest) {
    var myObject2;
    myObject2 = new ActiveXObject("Scripting.FileSystemObject");
    myObject2.CopyFile(src, dest);
}



function piechart() {

    var chart = new CanvasJS.Chart("chartContainer", {
        theme: "theme2",
        title: {
            text: "Test Summary Result"
        },
        data: [
            {
                type: "pie",
                showInLegend: true,
                toolTipContent: "{y} - #percent %",
                //yValueFormatString: "#,##0,,.## ",
                legendText: "{indexLabel}",
                dataPoints: [
                    {
                        y: noRunNumber,
                        indexLabel: "No Run"
                    },
                    {
                        y: failNumber,
                        indexLabel: "Fail"
                    },
                    {
                        y: passNumber,
                        indexLabel: "Pass"
                    },
                ]
            }
        ]
    });
    chart.render();
}


$(function () {
    $("#input").on("change", function () {
        var excelFile,
            fileReader = new FileReader();

        $("#result").hide();

        fileReader.onload = function (e) {
            var buffer = new Uint8Array(fileReader.result);

            $.ig.excel.Workbook.load(buffer, function (workbook) {
                var column, row, newRow, cellValue, columnIndex, i,
                    worksheet = workbook.worksheets(0),
                    columnsNumber = 0,
                    gridColumns = [],

                    worksheetRowsCount;


                // Both the columns and rows in the worksheet are lazily created and because of this most of the time worksheet.columns().count() will return 0
                // So to get the number of columns we read the values in the first row and count. When value is null we stop counting columns:
                while (worksheet.rows(0).getCellValue(columnsNumber)) {
                    columnsNumber++;
                }

                // Iterating through cells in first row and use the cell text as key and header text for the grid columns
                for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                    column = worksheet.rows(0).getCellText(columnIndex);
                    // console.log(column);
                    gridColumns.push({
                        headerText: column,
                        key: column
                    });
                }
                var noofcountforpass = 0;
                //var noofAdobeReaderIssue=0;
                // var noofWebexIssue=0;
                //var noofServerPerformanceIssue=0;
                //var noofPreconditiondatascriptfailed=0;
                var noofNo = 0;
                var noofNA = 0;
                var noofYES = 0;
                var noofcountforfail = 0;

                // We start iterating from 1, because we already read the first row to build the gridColumns array above
                // We use each cell value and add it to json array, which will be used as dataSource for the grid
                for (i = 1, worksheetRowsCount = worksheet.rows().count(); i < worksheetRowsCount; i++) {
                    newRow = {};
                    row = worksheet.rows(i);


                    for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                        cellValue = row.getCellText(columnIndex);
                        newRow[gridColumns[columnIndex].key] = cellValue;
                    }
                    if (newRow["Exucution-status"] == "PASS") {
                        noofcountforpass++;

                    }
                    if (newRow["Exucution-status"] == "FAIL" || newRow["Exucution-status"] == "Fail") {
                        noofcountforfail++;

                    }
                    if (newRow.Run == "No") {
                        noofNo++;

                    }
                    if (newRow.Run == "N/A") {
                        noofNA++;

                    }
                    if (newRow.Run == "Yes") {
                        noofYES++;

                    }

                    data.push(newRow);

                    if (profile.length == 0) {
                        profile.push(newRow.Module);

                    }
                    else {
                        for (var j = 0; j < profile.length; j++) {

                            if (profile[j] == newRow.Module) {
                                var x = 0;

                            }
                            if (j == profile.length - 1 && profile[j] != newRow.Module) {
                                profile.push(newRow.Module);
                            }

                        }


                    }





                    passNumber = noofcountforpass;
                    failNumber = noofcountforfail;
                    noRunNumber = noofNo;

                    // console.log("Pass" + "-----------------" + noofcountforpass);
                    // console.log("fail" + "-----------------" + noofcountforfail);
                    //  console.log("NO" + "-----------------" + noofNo);
                    // console.log("NA" + "-----------------" + noofNA);
                    // console.log("YES" + "-----------------" + noofYES);
                    // we can also skip passing the gridColumns use autoGenerateColumns = true, or modify the gridColumns array
                    createGrid(data, gridColumns);
                }

            },
                function (error) {
                    $("#result").text("The excel file is corrupted.");
                    $("#result").show(1000);
                });

        }

        if (this.files.length > 0) {
            excelFile = this.files[0];

            if (excelFile.type === "application/vnd.ms-excel" || excelFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || (excelFile.type === "" && (excelFile.name.endsWith("xls") || excelFile.name.endsWith("xlsx") || excelFile.name.endsWith("xlsm")))) {
                fileReader.readAsArrayBuffer(excelFile);


            } else {
                $("#result").text("The format of the file you have selected is not supported. Please select a valid Excel file ('.xls,xlsm, *.xlsx').");
                $("#result").show(1000);
            }
        }

    })

});
var varName;
var dataname;

function createGrid(data, gridColumns) {
    if ($("#grid1").data("igGrid") !== undefined) {
        $("#grid1").igGrid("destroy");
    }

    $("#grid1").igGrid({
        columns: gridColumns,
        autoGenerateColumns: true,
        dataSource: data,
        width: "100%"
    });
    piechart();
}
var htmldata1 = [];
var pathfile;
var backpath;
function back() {
    $('#test').hide();
    $('#fileData').hide();
    console.log(backpath);
    console.log(pathfile);
    //console.log(backpath != '/Reports');
   // console.log(backpath != '/Automation_Log');

    // backpath != '/Reports' && backpath != '/Automation_Log'
    if (backpath != '/Reports' && backpath != '/Automation_Log') {

        backpath = backpath.split('');
        console.log(pathfile);
        if (pathfile != undefined) {
            var pathfile1 = pathfile.split('')
            for (var i = pathfile1.length - 1; i >= 0; i--) {
                if (pathfile1[i] == '/') {
                    pathfile1.pop();
                    pathfile1 = pathfile1.join('');
                    pathfile = pathfile1;
                   // console.log(pathfile);
                    break;

                }
                else {
                    pathfile1.pop();

                }
            }
        }

        for (var i = backpath.length - 1; i >= 0; i--) {
            if (backpath[i] == '/') {
                backpath.pop();
                backpath = backpath.join('');
                //console.log(backpath);
                // backpath = backpath1;
                break;

            }
            else {
                backpath.pop();

            }
        }
    }
    // console.log(pathfile);
    //console.log(backpath);
    $.post("/app/back", { backpath }, function (data, status) {
        //console.log(data);
        $("#resultsfolder").empty();
        for (var i = 0; i < data.length; i++) {

            $("#resultsfolder").append('<li><a class="linkcss1" onclick="getFileDetails1(' + "'" + data[i] + "'" + ')" href="javascript:void(0)">' + data[i] + '</a></li>');
        }

    });

};
function getAutomation_log() {
    $('#test').hide();
    $('#datahtml').hide();
    $("#resultsfolder").show();
    $('#fileData').hide();
    $('#docdata').hide();
    $('#Automation_logfolder').show();
    $('#Project-Reports').show();
    $('#back').hide();
    backpath = "/Automation_Log";
 pathfile= "/Automation_Log";
    $.get("Automation_Log/", function (data, status) {

        htmldata1 = data;
        //console.log(htmldata1);
        $("#resultsfolder").empty();
        for (var i = 0; i < htmldata1.length; i++) {
            $("#resultsfolder").append('<li><a class="linkcss1" onclick="getFileDetails1(' + "'" + htmldata1[i] + "'" + ')" href="javascript:void(0)">' + htmldata1[i] + '</a></li>');
        }


    });

};
function ProjectReports() {
    $('#test').hide();
    $('#datahtml').hide();
    $("#resultsfolder").show();
    $('#fileData').hide();
    $('#docdata').hide();
     $('#back').hide();
    $('#Automation_logfolder').show();
    $('#Project-Reports').show();
    console.log( backpath);
     backpath = "/Reports";
     pathfile= "/Reports";
    $.get("ProjectReports/", function (data, status) {
       // backpath = "/Reports";
        htmldata1 = data;
       // console.log(htmldata1);
        $("#resultsfolder").empty();
        for (var i = 0; i < htmldata1.length; i++) {
            $("#resultsfolder").append('<li><a class="linkcss1" onclick="getProjectReprts(' + "'" + htmldata1[i] + "'" + ')" href="javascript:void(0)">' + htmldata1[i] + '</a></li>');
        }


    });

};
function getProjectReprts(data) {
   // console.log(data);
    $('#back').show();
    $('#datahtml').hide();
    console.log(pathfile);
    if (pathfile == undefined|| pathfile =="/Automation_Log") {
        pathfile = "/Reports/" + data;
        backpath = backpath + '/' + data;
        //console.log(backpath);
    }
    else {
        pathfile = pathfile + "/" + data;
        backpath = backpath + "/" + data;
        //console.log(backpath);
        console.log(pathfile);
    }
    
    $('#back').show();
    $("#resultsfolder").empty();
    //  console.log(data);
    if (data.search(".JPG") == -1 && data.search(".pdf") == -1 && data.search(".png") == -1 && data.search(".html") == -1 && data.search(".htm") == -1 && data.search(".doc") == -1 && data.search(".txt") == -1 && data.search(".docx") == -1 && data.search(".pptx") == -1) {
        $.post("/app/Reportfolder", { pathfile }, function (data, status) {
            // alert("Data: " + data + "\nStatus: " + status);

            htmldata1 = data;


            if (htmldata1) {
               // console.log(htmldata1);
                for (var i = 0; i < htmldata1.length; i++) {

                    $("#resultsfolder").append('<li><a class="linkcss" onclick="getProjectReprts(' + "'" + htmldata1[i] + "'" + ')" href="javascript:void(0)">' + htmldata1[i] + '</a></li>');
                }
            }
            else {
               // pathfile = undefined;

                $("#resultsfolder").append('<p>no files in that directory</p>');
            }
            // $('#resultsfolder').html(data);
        });
    }
    else if (data.search(".pdf") > -1) {

        $.post("/app/Reportfolderpdf", { pathfile }, function (data, status) {
            // var file= new Blob([data],{type:'application/pdf'});
            //var fileurl=URL.createObjectURL(file);
            // alert("hiiii")
            //  console.log(fileurl);
            window.open("data:application/pdf;base64, " + data);

            // $('#test').show();
            //$('#test').attr('src', 'data:png/jpg;base64,' + data);
            $('#pdfdata').attr('src', 'data:application/pdf;base64,' + data);
        });
    }
    else if (data.search(".html") > -1 || data.search(".txt") > -1) {


        $.post("/app/Reportfolderhtml", { pathfile }, function (data, status) {
          //  console.log(data);
            $('#fileData').show();
            $('#fileData').html(data);
        });
    }
    else if (data.search(".docx") > -1) {

        $('#docdata').show();
        $.post("/app/Reportfolderdocx", { pathfile }, function (data, status) {
            $('#docdata').attr('href', + data);
            //$('#docdata').attr('src', 'data:png/jpg;base64,' + data);
            //var file = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            // var fileurl = URL.createObjectURL(file);
            //window.open(fileurl);
            // $('#docdata').html(data);
            // $('#docdata').attr('src', 'data:docx/doc;base64,' + data);
        });
    }
    else if (data.search(".doc") > -1) {

        $('#docdata').show();
        $.post("/app/Reportfolderdoc", { pathfile }, function (data, status) {

            $('#docdata').html(data);
        });
    }

    else {
        $.post("/app/Reportfolderimage", { pathfile }, function (data, status) {
            $('#test').show();
            $('#test').attr('src', 'data:png/jpg;base64,' + data);
        });
    }
}

function getProfileItem() {
    pathfile = undefined;
    console.log(profile);
    $('#test').hide();
    $('#back').hide();
    $('#datahtml').hide();
    $("#resultsfolder").hide();
    $('#fileData').hide();
    $('#docdata').hide();
    $('#Automation_logfolder').show();
    $('#Project-Reports').show();

    if (profile.length > 1) {

        $(document).ready(function () {
            $('#grid1').DataTable({
                initComplete: function () {
                    this.api().columns().every(function () {
                        var column = this;
                        var select = $('<select><option value=""></option></select>')


                        column.data().unique().sort().each(function (d, j) {
                            select.append('<option value="' + d + '">' + d + '</option>')
                        });
                    });
                }
            });
        });
    }
}




var getFileDetails1 = function (data) {
    //console.log(data);
    $('#datahtml').hide();
    $('#test').hide();
     $('#back').show();
    console.log(pathfile);

    if (pathfile == undefined|| pathfile =="/Reports") {
        pathfile = "/Automation_Log/" + data;
        console.log(pathfile);
        backpath = backpath + "/" + data;
    }
    else {
        pathfile = pathfile + "/" + data;

        backpath = backpath + "/" + data;
       // console.log(pathfile);
        console.log(backpath);
    }

    $("#resultsfolder").empty();
    //  console.log(data);
    if (data.search(".JPG") == -1 && data.search(".pdf") == -1 && data.search(".png") == -1 && data.search(".html") == -1 && data.search(".htm") == -1 && data.search(".doc") == -1 && data.search(".txt") == -1 && data.search(".docx") == -1 && data.search(".pptx") == -1) {
        $.post("/app/folder", { pathfile }, function (data, status) {
            // alert("Data: " + data + "\nStatus: " + status);

            htmldata1 = data;


            if (htmldata1) {
               // console.log(htmldata1);
                for (var i = 0; i < htmldata1.length; i++) {

                    $("#resultsfolder").append('<li><a class="linkcss" onclick="getFileDetails1(' + "'" + htmldata1[i] + "'" + ')" href="javascript:void(0)">' + htmldata1[i] + '</a></li>');
                }
            }
            else {
                //pathfile = undefined;

                $("#resultsfolder").append('<p>no files in that directory</p>');
            }
            // $('#resultsfolder').html(data);
        });
    }
    else if (data.search(".pdf") > -1) {

        $.post("/app/folderpdf", { pathfile }, function (data, status) {
            // var file= new Blob([data],{type:'application/pdf'});
            //var fileurl=URL.createObjectURL(file);
            // alert("hiiii")
            //  console.log(fileurl);
            window.open("data:application/pdf;base64, " + data);

            // $('#test').show();
            //$('#test').attr('src', 'data:png/jpg;base64,' + data);
            $('#pdfdata').attr('src', 'data:application/pdf;base64,' + data);
        });
    }
    else if (data.search(".html") > -1 || data.search(".txt") > -1) {


        $.post("/app/folderhtml", { pathfile }, function (data, status) {
            //console.log(data);
            $('#fileData').show();
            $('#fileData').html(data);
        });
    }
    else if (data.search(".docx") > -1) {

        $('#docdata').show();
        $.post("/app/folderdocx", { pathfile }, function (data, status) {

            //$('#docdata').attr('src', 'data:png/jpg;base64,' + data);
            var file = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            var fileurl = URL.createObjectURL(file);
            window.open(fileurl);
            // $('#docdata').html(data);
            // $('#docdata').attr('src', 'data:docx/doc;base64,' + data);
        });
    }
    else if (data.search(".doc") > -1) {

        $('#docdata').show();
        $.post("/app/folderdoc", { pathfile }, function (data, status) {

            $('#docdata').html(data);
        });
    }

    else {
        $.post("/app/folderimage", { pathfile }, function (data, status) {
            $('#test').show();
            $('#test').attr('src', 'data:png/jpg;base64,' + data);
        });
    }
}


var htmldata;

$(document).ready(function () {
    $("#html").click(function () {
        $("#datahtml").empty();
        $('#test').hide();
        $('#docdata').empty();
        $('#Automation_logfolder').hide();
        $('#Project-Reports').hide();
        $.get("MainSuit/", function (data, status) {
            $("#resultsfolder").hide();
            $("#datahtml").show();

            htmldata = data;
            for (var i = 0; i < htmldata.length; i++) {

                $("#datahtml").append('<li><a class="linkcss3" onclick="getFileDetails(' + "'" + htmldata[i] + "'" + ')" href="javascript:void(0)">' + htmldata[i] + '</a></li>');
            }


        });
    });
});

var getFileDetails = function (data) {
    //alert(data);
    $.post("/app/test123", { data }, function (data, status) {
        // alert("Data: " + data + "\nStatus: " + status);
        //console.log(data);
        $('#fileData').html(data);
    });
}




