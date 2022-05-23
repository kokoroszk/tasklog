package repository

import domain.user.User
import scala.concurrent.Future

trait UserRepo {
  def getUser(id: String): Future[Option[User]]
  def getUsers(
    id: Option[Seq[String]] = None,
    projectId: Option[String] = None,
  ): Future[Seq[User]]
  def addNewUser(id: String, password: String, name: String, defaultProjectId: String): Future[Either[Exception, User]]
}