package domain.user

import cats.implicits._
import cats.data.EitherT
import repository.UserRepo

import javax.inject.{Inject, Singleton}
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

trait UserService {
  def signUp(id: String, password: String, name: String): EitherT[Future, Exception, User]
  def signIn(id: String, password: String): EitherT[Future, Exception, User]
  def getUserInfo(id: String): Future[Option[User]]
}

@Singleton
class UserServiceImpl @Inject()(userRepo: UserRepo) extends UserService {
  val bcrypt = new BCryptPasswordEncoder()

  def signUp(id: String, password: String, name: String): EitherT[Future, Exception, User] = for {
    _ <- EitherT {isAvailableUser(id)}
    id <- EitherT {userRepo.addNewUser(id, bcrypt.encode(password), name, "SAMPLE")}
  } yield id

  def signIn(id: String, password: String): EitherT[Future, Exception, User] = for {
    user <- EitherT {userRepo.getUser(id).map(_.fold(UnauthorizedException().asLeft[User])(_.asRight))}
    token <- EitherT {
      Future.successful(
        if (bcrypt.matches(password, user.password)) user.asRight[Exception]
        else UnauthorizedException().asLeft
      )
    }
  } yield token


  def getUserInfo(id: String): Future[Option[User]] = userRepo.getUser(id)

  private def isAvailableUser(id: String): Future[Either[Exception, Unit]] =
    userRepo.getUsers(Seq(id).some) map { user =>
      if (user.nonEmpty) ExistingIDException().asLeft
      else Right(())
    }

}

