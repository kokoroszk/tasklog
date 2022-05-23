package repository.impl.slick

import cats.implicits._
import codegen.slick.Tables
import domain.issue.{CannotModifyException, ChangeLogKind, Issue, IssueCategory, IssueKind, IssueStatus}
import org.joda.time.DateTime
import play.api.db.slick.DatabaseConfigProvider
import repository.IssueRepo
import repository.impl.slick.QueryBuilder._
import slick.jdbc.JdbcProfile
import slick.jdbc.MySQLProfile.api._

import javax.inject.{Inject, Singleton}
import scala.concurrent.{ExecutionContext, Future}

@Singleton
class SlickIssueRepo @Inject()(dbProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) extends IssueRepo {
  val db = dbProvider.get[JdbcProfile].db
  type IssueEntity = Tables.Issues

  private def issueEntityToIssueSeq(row: IssueEntity#TableElementType): Seq[Issue] = {
    val issue = for {
      status <- IssueStatus.valueOf(row.status)
      kind <- IssueKind.valueOf(row.kind)
    } yield Seq(Issue(
      id = row.id,
      projectId = row.projectId,
      kind = kind,
      title = row.title,
      description = row.description,
      assigneeId = row.assigneeId,
      status = status,
      dueDate = row.dueDate.map(toDateTime),
      createdAt = toDateTime(row.createdAt),
      updatedAt = toDateTime(row.updatedAt),
      createdBy = row.createdBy,
    ))
    issue.getOrElse(Seq.empty[Issue])
  }

  override def getIssues(
    ids: In[Int] = None,
    projectIds: In[String] = None,
    kinds: In[IssueKind.Value] = None,
    statuses: In[IssueStatus.Value] = None,
    assigneeIds: In[String] = None,
    dueDateAfter: Option[DateTime] = None,
    dueDateBefore: Option[DateTime] = None,
    createdAtAfter: Option[DateTime] = None,
    createdAtBefore: Option[DateTime] = None,
    updatedAtAfter: Option[DateTime] = None,
    updatedAtBefore: Option[DateTime] = None,
    createdBy: In[String] = None,
    keyword: Option[String] = None,
    limit: Option[Int] = None): Future[Seq[Issue]] = {

    val add = addCondition[IssueEntity](_)
    val queryBuilder = for {
      _ <- {(_: IssueEntity).id} in ids
      _ <- {(_: IssueEntity).projectId} in projectIds
      _ <- {(_: IssueEntity).kind} in kinds.map(_.map(_.id))
      _ <- {(_: IssueEntity).status} in statuses.map(_.map(_.id))
      _ <- {(_: IssueEntity).assigneeId} in assigneeIds
      _ <- {(_: IssueEntity).dueDate} >= dueDateAfter.map(toSqlTimestamp)
      _ <- {(_: IssueEntity).dueDate} <= dueDateBefore.map(toSqlTimestamp)
      _ <- {(_: IssueEntity).createdAt} >= createdAtAfter.map(toSqlTimestamp)
      _ <- {(_: IssueEntity).createdAt} <= createdAtBefore.map(toSqlTimestamp)
      _ <- {(_: IssueEntity).updatedAt} >= updatedAtAfter.map(toSqlTimestamp)
      _ <- {(_: IssueEntity).updatedAt} <= updatedAtBefore.map(toSqlTimestamp)
      _ <- {(_: IssueEntity).createdBy} in createdBy

      keyword_ = keyword map (k => s"%${k.replace("%", "\\%")}%")
      _ <- add { query => keyword_ map (k => query.filter(i => i.title.like(k) || i.description.like(k))) }
      _ <- addLimit(limit)
    } yield ()
    val query = queryBuilder.run(Tables.Issues).value._1
    db.run(query.result).map(_.flatMap(issueEntityToIssueSeq))
  }
  
  private def issueCategoryEntityToIssueCategory(row: Tables.IssueCategoriesRow) = IssueCategory(
    id = row.id,
    name = row.name
  )

  override def getIssueCategoriesRelByIssueIds(issueIds: Seq[Int]): Future[Seq[(Seq[Int], IssueCategory)]] = {
    db.run(
      Tables.XrefIssueIssueCategories
        .filter(_.issueId inSet issueIds)
        .join(Tables.IssueCategories).on(_.categoryId === _.id)
        .result
    ).map(result => {
      // XXX
      result.groupBy(_._2.id).toVector.map {
        case (_, categories) =>
          categories.map(_._1.issueId) -> categories.map(row => issueCategoryEntityToIssueCategory(row._2)).head
      }
    })
  }

  override def getIssueCategories(ids: Seq[Int]): Future[Seq[IssueCategory]] =
    db.run(Tables.IssueCategories.filter(_.id inSet ids).result)
      .map(_.map(issueCategoryEntityToIssueCategory))

  override def getIssueCategoriesByProjectId(projectId: String): Future[Seq[IssueCategory]] =
    db.run(Tables.IssueCategories.filter(_.projectId === projectId).result)
      .map(_.map(issueCategoryEntityToIssueCategory))

  override def updateIssue(
    id: Int,
    status: IssueStatus.Value,
    assigneeId: Option[String],
    dueDate: Option[DateTime],
    comment: String,
    userId: String,
    projectId: String): Future[Option[Issue]] = {

    val current = currentTimestamp
    val updateIssue = Tables.Issues
      .filter(_.id === id)
      .filter(_.projectId === projectId)
      .map(i => (i.status, i.assigneeId, i.dueDate, i.updatedAt))
      .update((status.id, assigneeId, dueDate.map(toSqlTimestamp), current))

    val insertChangeLog = Tables.ChangeLogs += Tables.ChangeLogsRow(
      id = 0,
      projectId = projectId,
      issueId = id,
      kind = ChangeLogKind.MODIFY.id,
      comment = comment,
      status = status.id,
      assigneeId = assigneeId,
      dueDate = dueDate.map(toSqlTimestamp),
      createdAt = current,
      createdBy = userId,
    )

    val fetchIssue = Tables.Issues.filter(_.id === id).filter(_.projectId === projectId).result

    val action = for {
      before <- fetchIssue.head
      _ <- if (
        before.assigneeId === assigneeId
          && before.dueDate.map(toDateTime) == dueDate
          && before.status === status.id
          && comment.isEmpty
      ) DBIO.failed(CannotModifyException()) else DBIO.successful(())
      _ <- updateIssue
      _ <- insertChangeLog
      after <- fetchIssue
    } yield after.flatMap(issueEntityToIssueSeq).headOption

    db.run(action.transactionally) recover[Option[Issue]] {
      case _: CannotModifyException => none[Issue]
      case e => throw e
    }
  }

  override def createIssue(
    kind: IssueKind.Value,
    title: String,
    description: String,
    assigneeId: Option[String],
    categories: Seq[Int],
    dueDate: Option[DateTime],
    userId: String,
    projectId: String): Future[Option[Issue]] = {
    val crrTime = currentTimestamp
    val newIssue = Tables.Issues.returning(Tables.Issues.map(_.id)).into((user, id) => user.copy(id = id)) +=
      Tables.IssuesRow(
        id = 0,
        projectId = projectId,
        kind = kind.id,
        status = IssueStatus.READY.id,
        title = title,
        description = description,
        assigneeId = assigneeId,
        dueDate = dueDate.map(toSqlTimestamp),
        createdAt = crrTime, updatedAt = crrTime, createdBy = userId
      )

    val insertChangeLog = (id: Int) => Tables.ChangeLogs += Tables.ChangeLogsRow(
      id = 0,
      projectId = projectId,
      issueId = id,
      kind = ChangeLogKind.MODIFY.id,
      comment = "",
      status = IssueStatus.READY.id,
      assigneeId = assigneeId,
      dueDate = dueDate.map(toSqlTimestamp),
      createdAt = crrTime,
      createdBy = userId,
    )

    val action = for {
      user <- newIssue
      _ <- insertChangeLog(user.id)
    } yield user

    db.run(action.transactionally).map(Seq(_).flatMap(issueEntityToIssueSeq).headOption)
  }
}
