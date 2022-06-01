package controllers

import cats.data.EitherT
import domain.user.{UnauthorizedException, User, UserService}
import org.joda.time.DateTime
import org.mockito.IdiomaticMockito.StubbingOps
import org.mockito.{ArgumentMatchersSugar, MockitoSugar}
import org.scalatestplus.play._
import play.api.test.Helpers._
import play.api.test._
import cats.implicits._
import io.circe.Json
import io.circe.syntax._

import scala.concurrent.Future

class AccountControllerSpec extends PlaySpec with MockitoSugar with ArgumentMatchersSugar {

  import akka.actor.ActorSystem
  import akka.stream.ActorMaterializer

  implicit val sys = ActorSystem("MyTest")
  implicit val mat = ActorMaterializer()

  val dummyUser = User(
    id = "testid",
    name = "testname",
    password = "testpassword",
    icon = None, currentProjectId = "testprojectId",
    createdAt = DateTime.now(),
    updatedAt = DateTime.now()
  )

  val userServiceMock = mock[UserService]
  val target = new AccountController(
    stubControllerComponents(),
    userServiceMock
  )

  def req(uri: String, body: Json) = FakeRequest[Json](
    method = POST,
    headers = FakeHeaders(Seq(CONTENT_TYPE -> "application/json")),
    uri = uri,
    body = body,
  )

  val validRequest = req("/signIn", Json.obj("id" -> "test".asJson, "password" -> "test".asJson))
  val validUser = EitherT {Future.successful(dummyUser.asRight[Exception])}

  "AccountController signIn" must {
    "return success values when user exists" in {
      userServiceMock.signIn(*, *) returns validUser

      val result = target.signIn(validRequest)
      status(result) mustBe 200
      (contentAsJson(result) \ "currentProjectId").get.as[String] mustBe dummyUser.currentProjectId
      session(result).get("userId") mustBe dummyUser.id.some
      session(result).get("currentProjectId") mustBe dummyUser.currentProjectId.some
    }

    "return 400 when response does not contains id" in {
      userServiceMock.signIn(*, *) returns validUser
      val request = req("/signIn", Json.obj("password" -> "test".asJson))

      val result = target.signIn().apply(request)
      status(result) mustBe 400
      session(result).get("userId") mustBe None
      session(result).get("currentProjectId") mustBe None
    }

    "return 400 when response does not contains password" in {
      userServiceMock.signIn(*, *) returns validUser
      val request = req("/signIn", Json.obj("id" -> "test".asJson))

      val result = target.signIn().apply(request)
      status(result) mustBe 400
      session(result).get("userId") mustBe None
      session(result).get("currentProjectId") mustBe None
    }

    "return 401 when userService returns UnauthorizedException" in {
      userServiceMock.signIn(*, *) returns EitherT {Future.successful(UnauthorizedException().asLeft)}

      val result = target.signIn(validRequest)
      status(result) mustBe 401
      session(result).get("userId") mustBe None
      session(result).get("currentProjectId") mustBe None
    }

    "return 500 when userService returns unexpected exception" in {
      userServiceMock.signIn(*, *) returns EitherT {Future.successful(UnauthorizedException().asLeft)}

      val result = target.signIn(validRequest)
      status(result) mustBe 401
      session(result).get("userId") mustBe None
      session(result).get("currentProjectId") mustBe None
    }
  }
}