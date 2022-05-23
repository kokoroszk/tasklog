package graphql

import repository.{ChangeLogRepo, IssueRepo, ProjectRepo, UserRepo}

import javax.inject.{Inject, Singleton}

trait GraphqlContext {
  val repo: RepositoryContainer
  val userId: String
  val projectId: String
}

case class GraphqlContextImpl(
  repo: RepositoryContainer,
  userId: String,
  projectId: String,
) extends GraphqlContext

trait RepositoryContainer {
  val userRepo: UserRepo
  val projectRepo: ProjectRepo
  val issueRepo: IssueRepo
  val changeLogRepo: ChangeLogRepo
}

@Singleton
class RepositoryContainerImpl @Inject() (
  val userRepo: UserRepo,
  val projectRepo: ProjectRepo,
  val issueRepo: IssueRepo,
  val changeLogRepo: ChangeLogRepo
) extends RepositoryContainer
