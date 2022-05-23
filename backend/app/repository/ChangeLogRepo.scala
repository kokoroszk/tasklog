package repository

import domain.issue.ChangeLog

import scala.concurrent.Future

trait ChangeLogRepo {
  def getChangeLogs(
    ids: Option[Seq[Int]] = None,
    projectIds: Option[Seq[String]] = None,
    issueIds: Option[Seq[Int]] = None,
    limit: Option[Int] = None
  ): Future[Seq[ChangeLog]]

  def getChangeLogsByIssueIds(
    issueIds: Seq[Int],
  ): Future[Seq[ChangeLog]]

  def getChangeLogsRelationByIssueIds(
    issueIds: Seq[Int],
  ): Future[Seq[(Seq[Int], ChangeLog)]]
}
