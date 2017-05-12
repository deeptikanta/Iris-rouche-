@REM  -----------------------------------------------------------------------
@REM  
@REM  Please verify:
@REM  You need to modify the following two line to point to your local folder strucutre
@REM  1. TestExecut is installed
@REM  2. TestComplete project file is at the righ location
@REM  3. Following folder paths, files exists (if log_folder not exist it will create automatically) and paths configued in Automation.bat file correctly.
@REM
@REM  Example:
@REM  set app_folder=C:\VirtuosoAutomation\
@REM  set log_folder=C:\Automation_Log\
@REM  set testexecute="C:\Program Files (x86)\SmartBear\TestExecute 9\Bin\TestExecute.exe"
@REM  set projectsuite="C:\VirtuosoAutomation\Virtuoso5.4.pjs"
@REM 
@REM  ------------------------------------------------------------------------
@REM  Revision History
@REM  Purpose: This batch file will launch by wnidows schedular based on its configuration. After this batch kik off it will perform following tasks @REM           sequentially
@REM           1. Get letest project updated from SVN
@REM	       2. Launch test execute
@REM           3. After execution completed, Create dataed folder structure for reports and screenshots
@REM           4. Copy all reports, Logs and screenshots in to corresponding folders created in above step.
@REM 				
@REM  Data Created: 06/14/2014		Created By: Samitha Karunaratne
@REM  Date Modified 06/17/2014		Updated By: Samitha Karunaratne		Reason: report_folder_summary path pointed to Workstationdata folder
@REM  Date Modified 07/07/2014		Updated By: Samitha Karunaratne		Reason: datetime stamp for folder creation updated to 24hr time
@REM  Date Modified 07/11/2014		Updated By: Samitha Karunaratne		Reason: Modified share log folder structure creation mechanism, Now           
@REM                                                                                    creating dated folders at the root level then inside virtuoso
@REM  											module wise result.
@REM  Date Modified 07/19/2014		Updated By: Samitha Karunaratne		Reason: Opening Adobe reader process to help faster report generation.
@REM
@REM  ------------------------------------------------------------------------


@REM Clears the screen
CLS
@ECHO OFF

@REM Clean up report folder for existing files. 
@REM Create folder structure in log_folder to place todays execution result.
@REM Update SVN for latest project updates.
@REM Launches TestExecute.
@REM Executes the specified project.
@REM Closes TestExecute when the run is over
@REM Copy todays result(report file, screen shots along with configs/pre-condition data used for current execution) to shared log folder.

@REM Define required static and dynamic variables. 
set app_folder=C:\Work\Automation\Dev\IRIS\v1\Smoke\Build\
set log_folder=C:\Automation_Log\
set testexecute="C:\Program Files (x86)\SmartBear\TestComplete 11\Bin\TestExecute.exe"
set projectsuite="C:\Work\Automation\Dev\IRIS\v1\Smoke\Build\IRIS.pjs"

set report_folder=%app_folder%Reports
@REM set report_folder_summary=%app_folder%WorkstationData\DDT\*.xlsm

set iris_screens=%app_folder%IRISPortal\Screenshots
set imageviewer_screens=%app_folder%ImageViewer\Screenshots



@REM Sets the proper date and time stamp with 24Hr Time for log file naming convention

SET HOUR=%time:~0,2%
SET dtStamp9=%date:~-10,2%%date:~-7,2%%date:~-4,4%_0%time:~1,1%%time:~3,2%%time:~6,2% 
SET dtStamp24=%date:~-10,2%%date:~-7,2%%date:~-4,4%_%time:~0,2%%time:~3,2%%time:~6,2%

if "%HOUR:~0,1%" == " " (SET folderId=%dtStamp9%) else (SET folderId=%dtStamp24%)


set log_folder_reports=%log_folder%%folderId%\Reports\

set log_folder_iris_today=%log_folder%%folderId%\IRISPortal\Screenshots
set log_folder_imageviewer_today=%log_folder%%folderId%\ImageViewer\Screenshots



set log_folder_reports_today=%log_folder_reports%
set log_file=AutomationLog_%date:~-10,2%%date:~-7,2%%date:~-4,4%_%time:~0,2%%time:~3,2%%time:~6,2%.mht

ECHO  %folderId%" Creating..."
mkdir %log_folder_iris_today% 
mkdir %log_folder_imageviewer_today%


mkdir %log_folder_reports_today%

ECHO %folderId%" Created..."

ECHO Cleanup project report folder before execution start...
DEL /F /S /Q /A %report_folder%\*.*

ECHO update SVN...
TortoiseProc.exe /command:update /path:"%app_folder%" /closeonend:1

@REM ECHO Opening a minimized adobe reader window...
@REM %adobereader% /h 

ECHO Launch TestExecute...
%testexecute% %projectsuite% /run /exit /SilentMode /exportlog:%log_folder_reports_today%\%log_file%

ECHO Making the copy of reports files and screenshots...
xcopy /d %report_folder% %log_folder_reports_today% /Y
xcopy /d %report_folder_summary% %log_folder_reports_today% /Y

xcopy /d %iris_screens% %log_folder_iris_today% /Y /S /E
xcopy /d %imageviewer_screens% %log_folder_imageviewer_today% /Y /S /E

ECHO Copping files to %log_folder% completed.

REM If errorlevel is equal to or greater than 4, go to unknown
IF ERRORLEVEL 4 GOTO Unknown
IF ERRORLEVEL 3 GOTO CannotRun
IF ERRORLEVEL 2 GOTO Errors
IF ERRORLEVEL 1 GOTO Warnings
IF ERRORLEVEL 0 GOTO Success

:Unknown
ECHO Unknown return code
GOTO End

:CannotRun
ECHO The test cannot be run
GOTO End

:Errors
ECHO There are errors
GOTO End

:Warnings
ECHO There are warnings
GOTO End

:Success
ECHO No errors
GOTO End

:End 


