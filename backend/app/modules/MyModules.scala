package modules

import com.google.inject.AbstractModule
import domain.user.{UserService, UserServiceImpl}
import graphql.{RepositoryContainer, RepositoryContainerImpl}
import repository.impl.slick.{SlickChangeLogRepo, SlickIssueRepo, SlickProjectRepo, SlickUserRepo}
import repository.{ChangeLogRepo, IssueRepo, ProjectRepo, UserRepo}

class MyModules extends AbstractModule {
  override def configure(): Unit = {
    // repositories
    bind(classOf[UserRepo]) to classOf[SlickUserRepo]
    bind(classOf[IssueRepo]) to classOf[SlickIssueRepo]
    bind(classOf[ProjectRepo]) to classOf[SlickProjectRepo]
    bind(classOf[RepositoryContainer]) to classOf[RepositoryContainerImpl]
    bind(classOf[ChangeLogRepo]) to classOf[SlickChangeLogRepo]

    // services
    bind(classOf[UserService]) to classOf[UserServiceImpl]
  }
}
