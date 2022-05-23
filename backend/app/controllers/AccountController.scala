package controllers

import cats.data.{EitherT, OptionT}
import cats.implicits._
import domain.user.{ExistingIDException, UnauthorizedException, UserService}
import io.circe.Json
import io.circe.jawn.decode
import io.circe.syntax.EncoderOps
import play.api.libs.circe.Circe
import play.api.mvc._

import javax.inject._
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class AccountController @Inject()(
  cc: ControllerComponents,
  userService: UserService
) extends AbstractController(cc)
  with Circe {

  def signUp: Action[Json] = Action.async(circe.json(1024)) { request =>
    val result = for {
      body <- EitherT {Future.successful(decode[SignUpRequest](request.body.toString))}
      user <- userService.signUp(body.id, body.password, body.name)
    } yield Ok(Json.obj("userId" -> user.id.asJson))
      .withSession(request.session
        + (SessionKey.userId -> user.id)
        + (SessionKey.currentProjectId -> user.currentProjectId)
      )

    result.valueOr { e =>
      (e match {
        case io.circe.DecodingFailure((msg, _)) => BadRequest(msg)
        case ExistingIDException() => Conflict
        case _ => InternalServerError
      }).withSession(request.session - SessionKey.userId - SessionKey.currentProjectId)
    }
  }

  def signIn: Action[Json] = Action.async(circe.json(1024)) { request =>

    val result = for {
      body <- EitherT {Future.successful(decode[SignInRequest](request.body.toString))}
      user <- userService.signIn(body.id, body.password)
    } yield Ok(Json.obj("currentProjectId" -> user.currentProjectId.asJson))
      .withSession(request.session
        + (SessionKey.userId -> user.id)
        + (SessionKey.currentProjectId -> user.currentProjectId))

    result.valueOr { e =>
      (e match {
        case io.circe.DecodingFailure((msg, _)) => BadRequest(msg)
        case UnauthorizedException() => Unauthorized
        case _ => InternalServerError
      }).withSession(request.session - SessionKey.userId - SessionKey.currentProjectId)
    }
  }

  def isSignedIn: Action[AnyContent] = Action.async { request =>
    val result = for {
      id <- OptionT {Future.successful(request.session.get(SessionKey.userId))}
      _ <- OptionT {userService.getUserInfo(id)}
    } yield Ok
    result.getOrElse(Unauthorized)
  }

  def signOut: Action[AnyContent] = Action { request =>
    Ok.withSession(request.session - SessionKey.userId - SessionKey.currentProjectId)
  }
}
