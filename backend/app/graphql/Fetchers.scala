package graphql

import cats.implicits._
import sangria.execution.deferred.{DeferredResolver, Fetcher, HasId, Relation, RelationIds}

import domain.issue.{ChangeLog, Issue, IssueCategory}
import domain.project.Project
import domain.user.User

object Fetchers {
  // fetchers
  protected[graphql] val issueIdToIssueCategoriesRel: Relation[IssueCategory, (Seq[Int], IssueCategory), Int] =
    Relation("issueIdToIssueCategoriesRel", _._1, _._2)

  protected[graphql] val issueIdToChangeLogsRel: Relation[ChangeLog, ChangeLog, Int] =
    Relation("issueIdToChangeLogsRel", c => Seq(c.issueId))

  protected[graphql] val issueCategoriesFetcher: Fetcher[GraphqlContext, IssueCategory, (Seq[Int], IssueCategory), Int] =
    Fetcher.relCaching(
      (ctx: GraphqlContext, ids: Seq[Int]) => ctx.repo.issueRepo.getIssueCategories(ids),
      (ctx: GraphqlContext, ids: RelationIds[IssueCategory]) =>
        ctx.repo.issueRepo.getIssueCategoriesRelByIssueIds(ids(issueIdToIssueCategoriesRel))
    )(HasId(_.id))

  protected[graphql] val changeLogsFetcher: Fetcher[GraphqlContext, ChangeLog, ChangeLog, Int] =
    Fetcher.relCaching(
      (ctx: GraphqlContext, ids: Seq[Int]) => ctx.repo.changeLogRepo.getChangeLogs(ids.some),
      (ctx: GraphqlContext, ids: RelationIds[ChangeLog]) =>
        ctx.repo.changeLogRepo.getChangeLogs(
          issueIds = ids(issueIdToChangeLogsRel).some,
          projectIds = Seq(ctx.projectId).some
        )
    )(HasId(_.id))

  protected[graphql] val usersFetcher: Fetcher[GraphqlContext, User, User, String] =
    Fetcher.caching {
      (ctx: GraphqlContext, ids: Seq[String]) => ctx.repo.userRepo.getUsers(ids.some)
    }(HasId(_.id))

  protected[graphql] val projectsFetcher: Fetcher[GraphqlContext, Project, Project, String] =
    Fetcher.caching {
      (ctx: GraphqlContext, ids: Seq[String]) => ctx.repo.projectRepo.getProjects(projectIds = ids.some)
    }(HasId(_.id))

  protected[graphql] val issuesFetcher: Fetcher[GraphqlContext, Issue, Issue, Int] =
    Fetcher.caching {
      (ctx: GraphqlContext, ids: Seq[Int]) => ctx.repo.issueRepo.getIssues(ids = ids.some)
    }(HasId(_.id))

  val fetchers = DeferredResolver.fetchers(
    usersFetcher,
    issuesFetcher,
    issueCategoriesFetcher,
    projectsFetcher,
    changeLogsFetcher
  )
}