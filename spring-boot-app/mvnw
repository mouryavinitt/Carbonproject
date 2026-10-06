#!/bin/sh
set -e

# Maven Wrapper script for Unix-based systems

MAVEN_VERSION=3.8.6
MAVEN_HOME="$PWD/.mvn/wrapper"

if [ ! -d "$MAVEN_HOME" ]; then
  mkdir -p "$MAVEN_HOME"
  curl -o "$MAVEN_HOME/maven-wrapper.jar" "https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/0.5.6/maven-wrapper-0.5.6.jar"
  curl -o "$MAVEN_HOME/maven-wrapper.properties" "https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/0.5.6/maven-wrapper-0.5.6.properties"
fi

exec java -cp "$MAVEN_HOME/maven-wrapper.jar" org.apache.maven.wrapper.MavenWrapperMain "$@"