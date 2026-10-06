@echo off
setlocal

rem Maven Wrapper for Windows

set MAVEN_HOME=%~dp0\.mvn\wrapper\maven-wrapper.jar
set MAVEN_OPTS=-Xmx1024m

if not exist "%MAVEN_HOME%" (
    echo Maven Wrapper not found. Please run mvnw to download it.
    exit /b 1
)

java %MAVEN_OPTS% -jar "%MAVEN_HOME%" %*
endlocal