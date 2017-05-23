var passNumber;
var failNumber;
var noRunNumber;
var profile = [];
var data = [];
$(document).ready(function () {

    $("#thead").hide();
     $('#test').hide();

});
// var noofAdmin = [];
// var noofLISConnector = [];
// var noofAssignReassign = [];
// var noofCollaboration = [];
// var noofGeneric = [];
// var noofIMS = [];
// var noofIntegratedViewClient = [];
// var noofIntegrated = [];
// var noofLIS = [];
// var noofQCModule = [];

function enableedit(editName, buttoname) {
    if (document.getElementById(buttoname).value == "Edit") {
        document.getElementById(editName).disabled = false;
        document.getElementById(buttoname).value = "Save";
    } else {
        document.getElementById(buttoname).value = "Edit";
        document.getElementById(editName).disabled = true;
    }


}

function createRunPlan() {

    var currentdate = new Date();
    var datetime = "" + currentdate.getDate() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getFullYear() + "-" + currentdate.getHours() + "_" + currentdate.getMinutes() + "_" + currentdate.getSeconds();
    //alert(datetime);
    var myObject, newpath;
    myObject = new ActiveXObject("Scripting.FileSystemObject");

    myObject.CopyFile("E:\\testfiles\\Testcase.xlsx", "E:\\testfiles\\Runplans\\Testcase.xlsx");
    f = new ActiveXObject("Scripting.FileSystemObject");
    f = myObject.GetFile("E:\\testfiles\\Runplans\\Testcase.xlsx");
    newpath = "Runplan" + datetime + ".xlsx";
    f.name = newpath;
    var filepath = "E:\\testfiles\\Runplans\\" + newpath;
    var res = replaceAll(filepath, "\\", "/");
    alert(res);

    //added for sheet hide
    var excel = new ActiveXObject("Excel.Application");
    excel.visible = false;
    var excel_file = excel.Workbooks.Open(res);
    excel_sheet = excel.Worksheets("Results").Visible = 0;
    //excel_sheet.Visible = 0;
    excel.ActiveWorkbook.Save();
    //excel_file.save;
    excel.quit;


    //sheet hide ends
    document.getElementById("openfile").href = res;
    document.getElementById("openfile").removeAttribute("disabled");
    document.getElementById("saveresult").disabled = "disabled";
}

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

function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}


function openFileOption() {
    document.getElementById("file1").click();
    var fullPath = document.getElementById('file1').value;
    //alert(fullPath);
    document.getElementById("filelink").href = fullPath;

}

function openFileOption2() {
    document.getElementById("file2").click();
    var fullPath2 = document.getElementById('file2').value;
    //alert(fullPath);
    document.getElementById("filelink2").href = fullPath2;
    document.getElementById("filelink2").disabled = "disabled";
}

function deleteandexeute() {
    var shell = new ActiveXObject("WScript.Shell");
    shell.Run("cmd /c e: & cd E:\\testfiles\\CurrentRun & del /q /f *.*");
    shell = null;
    var filepathtocopy = document.getElementById("filelink2").href;
    alert(filepathtocopy);
    var filepath = filepathtocopy.slice(8, filepathtocopy.length);
    alert(filepath);
    var filetocopy = replaceAll(filepath, "/", "\\\\");
    alert(filetocopy);

    copyfile(filetocopy, "E:\\testfiles\\CurrentRun\\Testfile.xlsx");
    logentry(filetocopy);
    logentryexcel(filetocopy);
}


function deleteNorows(filetocopy) {
    var excel2 = new ActiveXObject("Excel.Application");
    excel2.visible = false;
    var excel_file = excel.Workbooks.Open(filetocopy);
    var excel_sheet = excel.Worksheets("Configuration");

}



function logentry(filename) {
    var myObject;
    myObject = new ActiveXObject("Scripting.FileSystemObject");
    var f = myObject.OpenTextFile("E:\\testfiles\\Runlog\\AllRuns.txt", 8, true);
    //f = myObject.GetFile("E:\\testfiles\\Runlog\\AllRuns.txt");
    var datetime = getdatetime();
    f.WriteLine(datetime + "	" + filename);
    //f.WriteLine(filename);

}

function logentryexcel(filename) {
    myObject = new ActiveXObject("Scripting.FileSystemObject");
    var val = myObject.FileExists("E:\\testfiles\\Runlog\\AllRuns.xlsx");
    alert(val);
    if (val == "true") {
        var excel = new ActiveXObject("Excel.Application");
        excel.visible = false;
        var excel_file = excel.Workbooks.Open("E:\\testfiles\\Runlog\\AllRuns.xlsx");
        var excel_sheet = excel.Worksheets("Sheet1");
        var datetime = getdatetime();
        var row = excel_sheet.UsedRange.Rows.Count;
        alert(row);
        excel_sheet.Cells(row + 1, 1).Value = datetime;
        excel_sheet.Cells(row + 1, 2).Value = filename;
        excel.ActiveWorkbook.Save();
        //excel_file.save;
        excel.quit;
    } else {
        var excel = new ActiveXObject("Excel.Application");
        excel.visible = false;
        var excel_file = excel.Workbooks.add;
        var excel_sheet = excel.Worksheets("Sheet1");
        var datetime = getdatetime();
        excel_sheet.Cells(1, 1).Value = datetime;
        excel_sheet.Cells(1, 2).Value = filename;
        excel.ActiveWorkbook.SaveAs("E:\\testfiles\\Runlog\\AllRuns.xlsx");
        //excel_file.save;
        excel.quit;
    }


}


function copyfile(src, dest) {
    var myObject2;
    myObject2 = new ActiveXObject("Scripting.FileSystemObject");
    myObject2.CopyFile(src, dest);
}

function ReadData() {
    var excel = new ActiveXObject("Excel.Application");
    excel.visible = false;
    excel.DisplayAlerts = false;
    var data = data[m, n];
    var excel_file = excel.Workbooks.Open("C:\Users\Dpanda\Desktop\MainSuit\TestSuite-Summary.xml");
    //var excel_file = excel.Workbooks.Open("C:\\WorkVconnect\\TestSuite-Summary.xlxm");
    var excel_sheet = excel.Worksheets("Main");
    for (i = 0; i <= excel_sheet.Rows.Count; i++) {
        for (j = 0; j <= excel_sheet.Columns.Count; j++) {
            excel_sheet2.Cells(i, j).Value = data;
        }
    }
    var data = excel_sheet.Cells(row, cell).Value;

    excel_sheet2.Cells(2, 2).Value = arr;
    excel_file.SaveAs("E:\\Website.xlsx");
    alert(data);
    var WshShell = new ActiveXObject("WScript.Shell");
    var oExec = WshShell.Exec("taskkill /f /im excel.exe");
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

function ReadData1() {

    var excel = new AcitveXObject("Excel.Application");

    //var excel = Sys.OleObject("Excel.Application");
    excel.visible = true;
    excel.DisplayAlerts = false;
    var m = 0;
    var n = 0;
    var p = 0
    var data = [];

    var excel_file = excel.Workbooks.Open("C:\Users\Dpanda\Desktop\MainSuit\TestSuite-Summary.xlsm");
    console.log(excel_file);
    var excel_sheet = excel.Worksheets("Main");

    for (i = 1; i <= excel_sheet.UsedRange.Rows.Count; i++) {
        data[i] = [];
        for (j = 1; j <= excel_sheet.UsedRange.Columns.Count; j++) {
            var cellVal = excel_sheet.Cells(i, j).value;
            console.log(cellVal);
            if (cellVal == "PASS") {
                m = m + 1;
            }
            if (cellVal == "FAIL") {
                n = n + 1;
            }
            if (cellVal == "No") {
                p = p + 1;
            }
            data[i][j] = cellVal;

        }
    }

    passNumber = m;
    failNumber = n;
    noRunNumber = p

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

function getProfileItem() {
    pathfile = undefined;
    console.log(profile);
     $('#test').hide();
     //  $('#datahtml').hide();
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
    else {



        $.get("Automation_Log/", function (data, status) {

            htmldata1 = data;
            console.log(htmldata1);
            $("#resultsfolder").empty();
            for (var i = 0; i < htmldata1.length; i++) {
                $("#resultsfolder").append('<li><a onclick="getFileDetails1(' + "'" + htmldata1[i] + "'" + ')" href="javascript:void(0)">' + htmldata1[i] + '</a></li>');
            }


        });




    }
}




var getFileDetails1 = function (data) {

    if (pathfile == undefined) {
        pathfile = data;
    }
    else {
        pathfile = pathfile + "/" + data;
        // console.log(pathfile);
    }
    $("#resultsfolder").empty();
    console.log(data)
    if (data.search(".JPG") == -1) {
        $.post("/app/folder", { pathfile }, function (data, status) {
            // alert("Data: " + data + "\nStatus: " + status);

            htmldata1 = data;


            if (htmldata1) {
                console.log(htmldata1);
                for (var i = 0; i < htmldata1.length; i++) {

                    $("#resultsfolder").append('<li><a onclick="getFileDetails1(' + "'" + htmldata1[i] + "'" + ')" href="javascript:void(0)">' + htmldata1[i] + '</a></li>');
                }
            }
            else {
                pathfile = undefined;

                $("#resultsfolder").append('<p>no files in that directory</p>');
            }
            // $('#resultsfolder').html(data);
        });
    }
    else{
        $.post("/app/folderimage", { pathfile }, function (data, status) {
            $('#test').show();
            $('#test').attr('src', 'data:png/jpg;base64,' + data);
        });
    }
}


var htmldata;

$(document).ready(function () {
    $("#html").click(function () {
     
        $.get("MainSuit/", function (data, status) {


            htmldata = data;
            for (var i = 0; i < htmldata.length; i++) {
                  
                $("#datahtml").append('<li><a onclick="getFileDetails(' + "'" + htmldata[i] + "'" + ')" href="javascript:void(0)">' + htmldata[i] + '</a></li>');
            }


        });
    });
});

var getFileDetails = function (data) {
    alert(data);
    $.post("/app/test123", { data }, function (data, status) {
        // alert("Data: " + data + "\nStatus: " + status);
        //console.log(data);
        $('#fileData').html(data);
    });
}
