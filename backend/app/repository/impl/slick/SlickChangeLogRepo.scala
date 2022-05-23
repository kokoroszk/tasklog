package repository.impl.slick

import codegen.slick.Tables
import domain.issue.{ChangeLog, ChangeLogKind, IssueStatus}
import play.api.db.slick.DatabaseConfigProvider
import repository.ChangeLogRepo
import repository.impl.slick.QueryBuilder._
import slick.jdbc.JdbcProfile
import slick.jdbc.MySQLProfile.api._

import javax.inject.{Inject, Singleton}
import scala.concurrent.{ExecutionContext, Future}
import scala.language.implicitConversions


@Singleton
class SlickChangeLogRepo @Inject()(dbProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) extends
  ChangeLogRepo {
  val db = dbProvider.get[JdbcProfile].db

  type Entity = Tables.ChangeLogs

  def entityToChangeLogSeq(row: Tables.ChangeLogsRow): Seq[ChangeLog] = {
    val changeLogs = for {
      status <- IssueStatus.valueOf(row.status)
      kind <- ChangeLogKind.valueOf(row.kind)
    } yield Seq(ChangeLog(
      id = row.id,
      projectId = row.projectId,
      kind = kind,
      issueId = row.issueId,
      comment = row.comment,
      status = status,
      assigneeId = row.assigneeId,
      dueDate = row.dueDate.map(toDateTime),
      createdAt = toDateTime(row.createdAt),
      createdBy = row.createdBy,
    ))
    changeLogs getOrElse Seq.empty[ChangeLog]
  }

  def getChangeLogs(
    ids: In[Int] = None,
    projectIds: In[String] = None,
    issueIds: In[Int] = None,
    limit: Option[Int] = None
  ): Future[Seq[ChangeLog]] = {
    val queryBuilder = for {
      _ <- {(_: Entity).id} in ids
      _ <- {(_: Entity).projectId} in projectIds
      _ <- {(_: Entity).issueId} in issueIds
      _ <- addLimit(limit)
    } yield ()
    val query = queryBuilder.run(Tables.ChangeLogs).value._1
    db.run(query.result).map(_.flatMap(entityToChangeLogSeq))
  }

  override def getChangeLogsByIssueIds(issueIds: Seq[Int]): Future[Seq[ChangeLog]] =
    db.run(Tables.ChangeLogs.filter(_.issueId inSet issueIds).result).map(_.flatMap(entityToChangeLogSeq))

  override def getChangeLogsRelationByIssueIds(issueIds: Seq[Int]): Future[Seq[(Seq[Int], ChangeLog)]] =
    db.run(Tables.ChangeLogs.filter(_.issueId inSet issueIds).result).map(
      _.groupBy(_.id).toVector.map {
        case (_, changeLogs) =>
          changeLogs.map(_.issueId) -> changeLogs.flatMap(entityToChangeLogSeq).head
      })

}
