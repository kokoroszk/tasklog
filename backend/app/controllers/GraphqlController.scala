package controllers

import akka.actor.ActorSystem
import graphql.{Fetchers, GraphqlContext, GraphqlContextImpl, RepositoryContainer, SchemaDef}
import play.api.libs.json._
import play.api.mvc._
import sangria.execution._
import sangria.marshalling.playJson._
import sangria.parser.{QueryParser, SyntaxError}
import sangria.renderer.SchemaRenderer
import sangria.slowlog.SlowLog

import javax.inject.Inject
import scala.concurrent.Future
import scala.util.{Failure, Success}

class GraphqlController @Inject()(
  cc: ControllerComponents,
  system: ActorSystem,
  repo: RepositoryContainer) extends AbstractController(cc) {

  import system.dispatcher

  def playground = Action {
    Ok(views.html.playground())
  }

  def graphqlBody = Action.async(parse.json) { request =>
    val query = (request.body \ "query").as[String]
    val operation = (request.body \ "operationName").asOpt[String]
    val variables = (request.body \ "variables").toOption.flatMap {
      case JsString(vars) => Some(parseVariables(vars))
      case obj: JsObject => Some(obj)
      case _ => None
    }

    val ctx = for {
      userId <- request.session.get(SessionKey.userId)
      projectId <- request.session.get(SessionKey.currentProjectId)
    } yield GraphqlContextImpl(repo, userId, projectId)

    ctx match {
      case Some(ctx) => executeQuery(query, variables, operation, ctx, false)
      case None => Future.successful(Unauthorized)
    }
  }

  private def parseVariables(variables: String) =
    if (variables.trim == "" || variables.trim == "null") Json.obj() else Json.parse(variables).as[JsObject]

  private def executeQuery(
    query: String,
    variables: Option[JsObject],
    operation: Option[String],
    ctx: GraphqlContext,
    tracing: Boolean) =
    QueryParser.parse(query) match {

      case Success(queryAst) =>
        Executor.execute(SchemaDef.AppSchema, queryAst, ctx,
          operationName = operation,
          variables = variables getOrElse Json.obj(),
          deferredResolver = Fetchers.fetchers,
          exceptionHandler = exceptionHandler,
          queryReducers = List(
            QueryReducer.rejectMaxDepth[GraphqlContext](15),
            QueryReducer.rejectComplexQueries[GraphqlContext](4000, (_, _) => TooComplexQueryError)),
          middleware = if (tracing) SlowLog.apolloTracing :: Nil else Nil)
          .map(Ok(_))
          .recover {
            case error: QueryAnalysisError => BadRequest(error.resolveError)
            case error: ErrorWithResolver => InternalServerError(error.resolveError)
          }

      case Failure(error: SyntaxError) =>
        Future.successful(BadRequest(Json.obj(
          "syntaxError" -> error.getMessage,
          "locations" -> Json.arr(Json.obj(
            "line" -> error.originalError.position.line,
            "column" -> error.originalError.position.column)))))

      case Failure(error) =>
        throw error
    }

  def renderSchema = Action {
    Ok(SchemaRenderer.renderSchema(SchemaDef.AppSchema))
  }

  lazy val exceptionHandler = ExceptionHandler {
    case (_, error@TooComplexQueryError) => HandledException(error.getMessage)
    case (_, error@MaxQueryDepthReachedError(_)) => HandledException(error.getMessage)
  }

  case object TooComplexQueryError extends Exception("Query is too expensive.")
}