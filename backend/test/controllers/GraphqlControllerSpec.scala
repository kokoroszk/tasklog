package controllers

import graphql.RepositoryContainer
import org.mockito.{ArgumentMatchersSugar, MockitoSugar}
import play.api.libs.json.Json
import org.scalatestplus.play._
import play.api.test.Helpers._
import play.api.test._

class GraphqlControllerSpec extends PlaySpec with MockitoSugar with ArgumentMatchersSugar {

  import akka.actor.ActorSystem
  import akka.stream.ActorMaterializer

  implicit val sys = ActorSystem("MyTest")
  implicit val mat = ActorMaterializer()

  val target = new GraphqlController(
    stubControllerComponents(),
    mock[ActorSystem],
    mock[RepositoryContainer],
  )

  "GraphqlController graphqlBody" must {
    "return 401 when userId is not in session" in {
      val request = FakeRequest(POST, "/graphqlBody")
        .withHeaders(FakeHeaders(Seq(CONTENT_TYPE -> "application/json")))
        .withSession("currentProjectId" -> "testProject")
        .withBody(Json.parse("""{"query":"sample"}"""))

      val result = target.graphqlBody(request)
      status(result) mustBe 401
    }

    "return 401 when currentProjectId is not in session" in {
      val request = FakeRequest(POST, "/graphqlBody")
        .withHeaders(FakeHeaders(Seq(CONTENT_TYPE -> "application/json")))
        .withSession("userId" -> "testUser")
        .withBody(Json.parse("""{"query":"sample"}"""))

      val result = target.graphqlBody(request)
      status(result) mustBe 401
    }

    "return 400 when query syntax is invalid" in {
      val request = FakeRequest(POST, "/graphqlBody")
        .withHeaders(FakeHeaders(Seq(CONTENT_TYPE -> "application/json")))
        .withSession("userId" -> "testUser", "currentProjectId" -> "testProject")
        .withBody(Json.parse("""{"query":"sample"}"""))

      val result = target.graphqlBody(request)
      status(result) mustBe 400
    }

  }
}