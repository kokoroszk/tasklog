package domain.user
import org.joda.time.DateTime

final case class User(
  id: String,
  password: String,
  name: String,
  icon: Option[String],
  currentProjectId: String,
  createdAt: DateTime,
  updatedAt: DateTime,
)

final case class UnauthorizedException() extends Exception
final case class ExistingIDException() extends Exception