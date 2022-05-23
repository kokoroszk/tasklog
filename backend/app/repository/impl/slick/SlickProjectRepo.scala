package repository.impl.slick

import codegen.slick.Tables
import domain.project.Project
import play.api.db.slick.DatabaseConfigProvider
import repository.ProjectRepo
import repository.impl.slick.QueryBuilder._
import slick.jdbc.JdbcProfile
import slick.jdbc.MySQLProfile.api._

import javax.inject.{Inject, Singleton}
import scala.concurrent.{ExecutionContext, Future}
import scala.language.implicitConversions

@Singleton
class SlickProjectRepo @Inject()(dbProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) extends
  ProjectRepo {
  val db = dbProvider.get[JdbcProfile].db
  type Entity = Tables.Projects

  override def getProjects(ids: In[String], limit: Option[Int]): Future[Seq[Project]] = {
    val queryBuilder = for {
      _ <- {(_: Entity).id} in ids
      _ <- addLimit(limit)
    } yield ()
    val query = queryBuilder.run(Tables.Projects).value._1

    db.run(query.result).map(_.map(r => Project(
      id = r.id,
      name = r.name
    )))
  }
}
