name := """portfolio"""
organization := "com.github.kokoroszk"

version := "1.0-SNAPSHOT"

scalaVersion := "2.12.8"
val catsVersion = "2.4.0"
val sangriaVersion = "2.0.1"
val circeVersion = "0.14.1"

libraryDependencies += guice

libraryDependencies += "org.springframework.security" % "spring-security-web" % "5.6.3"
//libraryDependencies += "org.mindrot" % "jbcrypt" % "0.4"

// Database
libraryDependencies +="mysql" % "mysql-connector-java" % "8.0.25"
libraryDependencies ++= Seq(
  "com.typesafe.play" %% "play-slick" % "5.0.0",
  "com.typesafe.play" %% "play-slick-evolutions" % "5.0.0",
  "com.typesafe.slick" %% "slick-codegen" % "3.3.3",
  "com.typesafe.slick" %% "slick" % "3.3.3",
  "joda-time" % "joda-time" % "2.10.13",
  "org.joda" % "joda-convert" % "2.2.2",
  "com.github.tototoshi" %% "slick-joda-mapper" % "2.4.2"
)

// Graphql
libraryDependencies ++= Seq(
  "org.sangria-graphql" %% "sangria",
  "org.sangria-graphql" %% "sangria-slowlog",
  "org.sangria-graphql" %% "sangria-play-json"
).map(_ % sangriaVersion)


// Json
libraryDependencies ++= Seq(
  "io.circe" %% "circe-core",
  "io.circe" %% "circe-generic",
  "io.circe" %% "circe-generic-extras",
  "io.circe" %% "circe-parser"
).map(_ % circeVersion)
libraryDependencies += "com.dripower" %% "play-circe" % "2814.2"


// Cats
libraryDependencies ++= Seq(
  "org.typelevel" %% "cats-core",
  "org.typelevel" %% "cats-kernel",
  "org.typelevel" %% "cats-effect",
  "org.typelevel" %% "cats-free",
  "org.typelevel" %% "cats-laws",
).map(_ % catsVersion)

libraryDependencies += "org.typelevel" %% "simulacrum" % "1.0.1"
addCompilerPlugin("org.typelevel" %% "kind-projector" % "0.10.3")
addCompilerPlugin("org.scalamacros" % "paradise" % "2.1.0" cross CrossVersion.full)
scalacOptions += "-Ypartial-unification"

// Unit test
libraryDependencies ++= Seq(
  "org.scalatestplus.play" %% "scalatestplus-play" % "5.0.0",
  "org.mockito" %% "mockito-scala" % "1.17.5"
).map(_ % Test)


lazy val root = (project in file(".")).enablePlugins(PlayScala).settings(slick := slick.value)
lazy val slick = taskKey[Seq[File]]("Generate Tables.scala")
slick := {
  val srcDir = file("./app/")
//  val dir = (Compile / sourceManaged).value
//  val outputDir = dir / "slick"
  val url = "jdbc:mysql://127.0.0.1:3306/portfolio"
  val jdbcDriver = "com.mysql.cj.jdbc.Driver"
  val slickDriver = "slick.jdbc.MySQLProfile"
  val pkg = "codegen.slick"
  val user = "portfolio"
  val pass = "portfolio"

  val cp = (Compile / dependencyClasspath) value
  val s = streams value

  runner.value.run("slick.codegen.SourceCodeGenerator",
    cp.files,
    Array(slickDriver, jdbcDriver, url, srcDir.getPath, pkg, user, pass),
    s.log).failed foreach (sys error _.getMessage)

  val filename = srcDir / "Tables.scala"

  Seq(file(filename.getPath))
}


