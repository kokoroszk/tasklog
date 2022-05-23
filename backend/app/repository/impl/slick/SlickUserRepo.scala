package repository.impl.slick

import cats.data.EitherT
import cats.implicits.{catsSyntaxEitherId, catsSyntaxEq}
import codegen.slick.Tables
import domain.user.{ExistingIDException, User}
import play.api.db.slick.DatabaseConfigProvider
import repository.UserRepo
import repository.impl.slick.QueryBuilder._
import slick.jdbc.JdbcProfile
import slick.jdbc.MySQLProfile.api._

import javax.inject.{Inject, Singleton}
import scala.concurrent.{ExecutionContext, Future}

@Singleton
class SlickUserRepo @Inject()(dbProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) extends UserRepo {
  val db = dbProvider.get[JdbcProfile].db

  def entityToUser(row: Tables.Users#TableElementType) = User(
    id = row.id,
    name = row.name,
    password = row.password,
    icon = row.icon,
    currentProjectId = row.currentProjectId,
    createdAt = toDateTime(row.createdAt),
    updatedAt = toDateTime(row.updatedAt),
  )

  override def getUser(id: String): Future[Option[User]] = for {
    users <- db.run(Tables.Users.filter(_.id === id).take(1).result)
  } yield users.headOption.map(entityToUser)


  override def getUsers(
    id: Option[Seq[String]] = None,
    projectId: Option[String] = None
  ): Future[Seq[User]] = {
    val queryBuilder = for {
      _ <- {(_: Tables.Users).id} in id
      _ <- {(_: Tables.Users).currentProjectId} === projectId
    } yield ()

    val query = queryBuilder.run(Tables.Users).value._1;
      for {
      users <- db.run(query.result)
    } yield users.map(entityToUser)
  }

  override def addNewUser(id: String, password: String, name: String, currentProjectId: String)
  : Future[Either[Exception, User]] = {
    val current = currentTimestamp
    val insert =
      Tables.Users += Tables.UsersRow(
        id = id,
        name = name,
        currentProjectId = currentProjectId,
        password = password,
        createdAt = current,
        updatedAt = current)

    val user = for {
      _ <- EitherT {db.run(insert) map { cnt => if (cnt === 0) ExistingIDException().asLeft else id.asRight }}
      user <- EitherT {
        db.run(Tables.Users.filter(_.id === id).result)
          .map(_.headOption.map(entityToUser).fold(new Exception().asLeft[User])(_.asRight[Exception]))
      }
    } yield user

    user.value
  }
}
