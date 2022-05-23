package graphql

import cats.implicits._
import sangria.schema._
import sangria.macros.derive.{AddFields, ExcludeFields, ObjectTypeDescription, ObjectTypeName, ReplaceField, deriveEnumType, deriveObjectType}
import domain.issue.{ChangeLog, ChangeLogKind, Issue, IssueCategory, IssueKind, IssueStatus}
import domain.project.Project
import domain.user.User
import graphql.Fetchers._
import graphql.CustomScalar._

object SchemaDef {

  // types
  val Project: ObjectType[GraphqlContext, Project] = deriveObjectType[GraphqlContext, Project](
    ObjectTypeName("Project"),
    ObjectTypeDescription("A project in this system."),
  )

  val User: ObjectType[GraphqlContext, User] = deriveObjectType(
    ObjectTypeDescription("A user in this system."),
    ExcludeFields("password"),
    ReplaceField("currentProjectId", Field("project", Project,
      resolve = ctx => projectsFetcher.defer(ctx.value.currentProjectId))
    ),
  )

  val IssueCategory: ObjectType[GraphqlContext, IssueCategory] = deriveObjectType(
    ObjectTypeDescription("A category of a issue.")
  )

  val ChangeLog: ObjectType[GraphqlContext, ChangeLog] = deriveObjectType(
    ObjectTypeDescription("A change log of a issue."),
    ReplaceField("issueId", Field("issue", Issue, resolve = ctx => issuesFetcher.defer(ctx.value.issueId))),
    ReplaceField("projectId", Field("project", Project, resolve = ctx => projectsFetcher.defer(ctx.value.projectId))),
    ReplaceField("createdBy", Field("createdBy", User, resolve = ctx => usersFetcher.defer(ctx.value.createdBy))),
    ReplaceField("status", Field("status", IntType, resolve = _.value.status.id)),
    ReplaceField("kind", Field("kind", IntType, resolve = _.value.kind.id)),
    ReplaceField("assigneeId", Field("assignee", OptionType(User),
      resolve = ctx => usersFetcher.deferOpt(ctx.value.assigneeId))
    ),
  )

  val Issue = deriveObjectType[GraphqlContext, Issue](
    ObjectTypeName("Issue"),
    ObjectTypeDescription("A issue in this system."),
    ReplaceField("kind", Field("kind", IntType, resolve = _.value.kind.id)),
    ReplaceField("status", Field("status", IntType, resolve = _.value.status.id)),
    ReplaceField("createdBy", Field("createdBy", User, resolve = ctx => usersFetcher.defer(ctx.value.createdBy))),
    ReplaceField("assigneeId", Field("assignee", OptionType(User),
      resolve = ctx => usersFetcher.deferOpt(ctx.value.assigneeId)),
    ),
    AddFields[GraphqlContext, Issue](
      Field("categories", ListType(IssueCategory),
        resolve = ctx => issueCategoriesFetcher.deferRelSeq(issueIdToIssueCategoriesRel, ctx.value.id)),
      Field("changeLogs", ListType(ChangeLog),
        resolve = ctx => changeLogsFetcher.deferRelSeq(issueIdToChangeLogsRel, ctx.value.id)),
    ),
  )

  // variables
  val ISSUE_IDS = Argument("issueIds", OptionInputType(ListInputType(IntType)))
  val PROJECT_ID = Argument("projectIds", OptionInputType(ListInputType(StringType)))
  val ISSUE_ID = Argument("issueId", IntType)
  val ISSUE_STATUS = Argument("issueStatus", IntType)
  val ISSUE_KIND = Argument("issueKind", IntType)
  val ASSIGNEE_ID = Argument("assigneeId", OptionInputType(StringType))
  val DUE_DATE = Argument("dueDate", OptionInputType(DateTimeType))
  val COMMENT = Argument("comment", StringType)
  val ISSUE_CATEGORIES = Argument("issueCategories", ListInputType(IntType))
  val TITLE = Argument("title", StringType)
  val DESCRIPTION = Argument("description", StringType)

  // queries
  val Query = ObjectType(
    "Query", fields[GraphqlContext, Unit](
      Field("issues", ListType(Issue),
        arguments = ISSUE_IDS :: Nil,
        resolve =
          ctx => ctx.ctx.repo.issueRepo.getIssues(ids = ctx arg ISSUE_IDS, projectIds = Seq(ctx.ctx.projectId).some)),
      Field("currentUser", OptionType(User),
        resolve = ctx => ctx.ctx.repo.userRepo.getUser(ctx.ctx.userId)
      ),
      Field("projectChangeLogs", ListType(ChangeLog),
        resolve = ctx => ctx.ctx.repo.changeLogRepo.getChangeLogs(projectIds = List(ctx.ctx.projectId).some)
      ),
      Field("users", ListType(User),
        resolve = ctx => ctx.ctx.repo.userRepo.getUsers(projectId = ctx.ctx.projectId.some)
      ),
      Field("issueCategories", ListType(IssueCategory),
        resolve = ctx => ctx.ctx.repo.issueRepo.getIssueCategoriesByProjectId(ctx.ctx.projectId)
      ),
    )
  )

  // mutations
  val Mutation: ObjectType[GraphqlContext, Unit] = {
    ObjectType(
      "Mutation",
      fields[GraphqlContext, Unit](
        Field(
          "updateIssue",
          arguments = ISSUE_ID :: ISSUE_STATUS :: ASSIGNEE_ID :: DUE_DATE :: COMMENT :: Nil,
          fieldType = OptionType(Issue),
          resolve = c => c.ctx.repo.issueRepo.updateIssue(
            id = c arg ISSUE_ID,
            projectId = c.ctx.projectId,
            status = IssueStatus.valueOf(c arg ISSUE_STATUS).get,
            assigneeId = c arg ASSIGNEE_ID,
            dueDate = c arg DUE_DATE,
            comment = c arg COMMENT,
            userId = c.ctx.userId
          )
        ),
        Field(
          "createIssue",
          arguments =
            TITLE :: DESCRIPTION :: ISSUE_KIND :: ASSIGNEE_ID :: DUE_DATE :: ISSUE_CATEGORIES :: Nil,
          fieldType = OptionType(Issue),
          resolve = c => c.ctx.repo.issueRepo.createIssue(
            assigneeId = c arg ASSIGNEE_ID,
            dueDate = c arg DUE_DATE,
            kind = IssueKind.valueOf(c arg ISSUE_KIND).get,
            projectId = c.ctx.projectId,
            userId = c.ctx.userId,
            categories = c arg ISSUE_CATEGORIES,
            title = c arg TITLE,
            description = c arg DESCRIPTION,
          )
        ),
      )
    )
  }

  val AppSchema = Schema(Query, Mutation.some)
}