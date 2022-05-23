package domain.issue

import org.joda.time.DateTime

object IssueStatus extends Enumeration {
  val READY: IssueStatus.Value = Value(0)
  val IN_PROGRESS: IssueStatus.Value = Value(1)
  val PROCESSED: IssueStatus.Value = Value(2)
  val DONE: IssueStatus.Value = Value(3)
  def valueOf(id: Int): Option[IssueStatus.Value] = this.values.find(_.id == id)
}

object IssueKind extends Enumeration {
  val TASK: IssueKind.Value = Value(0)
  val BUG: IssueKind.Value = Value(1)
  val REQUEST: IssueKind.Value = Value(2)
  val OTHER: IssueKind.Value = Value(3)
  def valueOf(id: Int): Option[IssueKind.Value] = this.values.find(_.id == id)
}

object ChangeLogKind extends Enumeration {
  val CREATE: ChangeLogKind.Value = Value(0)
  val MODIFY: ChangeLogKind.Value = Value(1)
  def valueOf(id: Int): Option[ChangeLogKind.Value] = this.values.find(_.id == id)
}

case class IssueCategory(
  id: Int,
  name: String,
)

case class Issue(
  id: Int,
  projectId: String,
  kind: IssueKind.Value,
  title: String,
  description: String,
  assigneeId: Option[String],
  status: IssueStatus.Value,
  dueDate: Option[DateTime],
  createdAt: DateTime,
  updatedAt: DateTime,
  createdBy: String,
)

case class ChangeLog(
  id: Int,
  projectId: String,
  issueId: Int,
  kind: ChangeLogKind.Value,
  comment: String,
  status: IssueStatus.Value,
  assigneeId: Option[String],
  dueDate: Option[DateTime],
  createdAt: DateTime,
  createdBy: String,
)
final case class CannotModifyException() extends Exception
