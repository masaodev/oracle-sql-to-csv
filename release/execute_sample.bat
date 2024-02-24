@echo off
set BASE_PATH=%~dp0

rem ------------------------------
rem Connection Setting
set CONFIG_FILE=config\connection-config.json
rem Execute SQL
set SQL_FILE=sql\sample.sql
rem ------------------------------

oracleDbQueryToCSV.exe %BASE_PATH%\%CONFIG_FILE% %SQL_FILE%