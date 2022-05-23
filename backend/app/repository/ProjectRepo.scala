package repository

import scala.concurrent.Future

import domain.project.Project

trait ProjectRepo {
  def getProjects(
    projectIds: Option[Seq[String]] = None,
    limit: Option[Int] = None
  ): Future[Seq[Project]]
}
