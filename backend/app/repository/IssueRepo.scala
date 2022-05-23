package repository

import scala.concurrent.Future
import org.joda.time.DateTime

import domain.issue.{Issue, IssueCategory, IssueKind, IssueStatus}

trait IssueRepo {
  def getIssues(
    ids: Option[Seq[Int]] = None,
    projectIds: Option[Seq[String]] = None,
    kinds: Option[Seq[IssueKind.Value]] = None,
    statuses: Option[Seq[IssueStatus.Value]] = None,
    assigneeIds: Option[Seq[String]] = None,
    dueDateAfter: Option[DateTime] = None,
    dueDateBefore: Option[DateTime] = None,
    createdAtAfter: Option[DateTime] = None,
    createdAtBefore: Option[DateTime] = None,
    updatedAtAfter: Option[DateTime] = None,
    updatedAtBefore: Option[DateTime] = None,
    createdBy: Option[Seq[String]] = None,
    keyword: Option[String] = None,
    limit: Option[Int] = None): Future[Seq[Issue]]

  def getIssueCategories(
    ids: Seq[Int]
  ): Future[Seq[IssueCategory]]

  def getIssueCategoriesRelByIssueIds(
    issueIds: Seq[Int]
  ): Future[Seq[(Seq[Int], IssueCategory)]]

  def getIssueCategoriesByProjectId(
    projectId: String
  ): Future[Seq[IssueCategory]]

  def updateIssue(
    id: Int,
    status: IssueStatus.Value,
    assigneeId: Option[String],
    dueDate: Option[DateTime],
    comment: String,
    userId: String,
    projectId: String): Future[Option[Issue]]

  def createIssue(
    kind: IssueKind.Value,
    title: String,
    description: String,
    assigneeId: Option[String],
    categories: Seq[Int],
    dueDate: Option[DateTime],
    userId: String,
    projectId: String,
  ): Future[Option[Issue]]
}
