package codegen.slick
// AUTO-GENERATED Slick data model
/** Stand-alone Slick data model for immediate use */
object Tables extends {
  val profile = slick.jdbc.MySQLProfile
} with Tables

/** Slick data model trait for extension, choice of backend or usage in the cake pattern. (Make sure to initialize this late.) */
trait Tables {
  val profile: slick.jdbc.JdbcProfile
  import profile.api._
  import slick.model.ForeignKeyAction
  // NOTE: GetResult mappers for plain SQL are only generated for tables where Slick knows how to map the types of all columns.
  import slick.jdbc.{GetResult => GR}

  /** DDL for all tables. Call .create to execute. */
  lazy val schema: profile.SchemaDescription = Array(ChangeLogs.schema, IssueCategories.schema, Issues.schema, PlayEvolutions.schema, Projects.schema, Users.schema, XrefIssueIssueCategories.schema, XrefUserProjects.schema).reduceLeft(_ ++ _)
  @deprecated("Use .schema instead of .ddl", "3.0")
  def ddl = schema

  /** Entity class storing rows of table ChangeLogs
   *  @param id Database column id SqlType(INT), AutoInc, PrimaryKey
   *  @param projectId Database column project_id SqlType(VARCHAR), Length(32,true)
   *  @param issueId Database column issue_id SqlType(INT)
   *  @param kind Database column kind SqlType(INT)
   *  @param comment Database column comment SqlType(TEXT)
   *  @param status Database column status SqlType(INT)
   *  @param assigneeId Database column assignee_id SqlType(VARCHAR), Length(64,true), Default(None)
   *  @param dueDate Database column due_date SqlType(DATETIME), Default(None)
   *  @param createdAt Database column created_at SqlType(DATETIME)
   *  @param createdBy Database column created_by SqlType(VARCHAR), Length(64,true) */
  case class ChangeLogsRow(id: Int, projectId: String, issueId: Int, kind: Int, comment: String, status: Int, assigneeId: Option[String] = None, dueDate: Option[java.sql.Timestamp] = None, createdAt: java.sql.Timestamp, createdBy: String)
  /** GetResult implicit for fetching ChangeLogsRow objects using plain SQL queries */
  implicit def GetResultChangeLogsRow(implicit e0: GR[Int], e1: GR[String], e2: GR[Option[String]], e3: GR[Option[java.sql.Timestamp]], e4: GR[java.sql.Timestamp]): GR[ChangeLogsRow] = GR{
    prs => import prs._
    ChangeLogsRow.tupled((<<[Int], <<[String], <<[Int], <<[Int], <<[String], <<[Int], <<?[String], <<?[java.sql.Timestamp], <<[java.sql.Timestamp], <<[String]))
  }
  /** Table description of table change_logs. Objects of this class serve as prototypes for rows in queries. */
  class ChangeLogs(_tableTag: Tag) extends profile.api.Table[ChangeLogsRow](_tableTag, Some("portfolio"), "change_logs") {
    def * = (id, projectId, issueId, kind, comment, status, assigneeId, dueDate, createdAt, createdBy) <> (ChangeLogsRow.tupled, ChangeLogsRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = ((Rep.Some(id), Rep.Some(projectId), Rep.Some(issueId), Rep.Some(kind), Rep.Some(comment), Rep.Some(status), assigneeId, dueDate, Rep.Some(createdAt), Rep.Some(createdBy))).shaped.<>({r=>import r._; _1.map(_=> ChangeLogsRow.tupled((_1.get, _2.get, _3.get, _4.get, _5.get, _6.get, _7, _8, _9.get, _10.get)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column id SqlType(INT), AutoInc, PrimaryKey */
    val id: Rep[Int] = column[Int]("id", O.AutoInc, O.PrimaryKey)
    /** Database column project_id SqlType(VARCHAR), Length(32,true) */
    val projectId: Rep[String] = column[String]("project_id", O.Length(32,varying=true))
    /** Database column issue_id SqlType(INT) */
    val issueId: Rep[Int] = column[Int]("issue_id")
    /** Database column kind SqlType(INT) */
    val kind: Rep[Int] = column[Int]("kind")
    /** Database column comment SqlType(TEXT) */
    val comment: Rep[String] = column[String]("comment")
    /** Database column status SqlType(INT) */
    val status: Rep[Int] = column[Int]("status")
    /** Database column assignee_id SqlType(VARCHAR), Length(64,true), Default(None) */
    val assigneeId: Rep[Option[String]] = column[Option[String]]("assignee_id", O.Length(64,varying=true), O.Default(None))
    /** Database column due_date SqlType(DATETIME), Default(None) */
    val dueDate: Rep[Option[java.sql.Timestamp]] = column[Option[java.sql.Timestamp]]("due_date", O.Default(None))
    /** Database column created_at SqlType(DATETIME) */
    val createdAt: Rep[java.sql.Timestamp] = column[java.sql.Timestamp]("created_at")
    /** Database column created_by SqlType(VARCHAR), Length(64,true) */
    val createdBy: Rep[String] = column[String]("created_by", O.Length(64,varying=true))

    /** Foreign key referencing Issues (database name change_logs_ibfk_1) */
    lazy val issuesFk = foreignKey("change_logs_ibfk_1", issueId, Issues)(r => r.id, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Restrict)
    /** Foreign key referencing Projects (database name change_logs_ibfk_2) */
    lazy val projectsFk = foreignKey("change_logs_ibfk_2", projectId, Projects)(r => r.id, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Restrict)
    /** Foreign key referencing Users (database name change_logs_ibfk_3) */
    lazy val usersFk3 = foreignKey("change_logs_ibfk_3", assigneeId, Users)(r => Rep.Some(r.id), onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Restrict)
    /** Foreign key referencing Users (database name change_logs_ibfk_4) */
    lazy val usersFk4 = foreignKey("change_logs_ibfk_4", createdBy, Users)(r => r.id, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Restrict)

    /** Index over (projectId,createdAt) (database name idx_project_id_created_at) */
    val index1 = index("idx_project_id_created_at", (projectId, createdAt))
  }
  /** Collection-like TableQuery object for table ChangeLogs */
  lazy val ChangeLogs = new TableQuery(tag => new ChangeLogs(tag))

  /** Entity class storing rows of table IssueCategories
   *  @param id Database column id SqlType(INT), AutoInc, PrimaryKey
   *  @param name Database column name SqlType(VARCHAR), Length(32,true)
   *  @param projectId Database column project_id SqlType(VARCHAR), Length(32,true) */
  case class IssueCategoriesRow(id: Int, name: String, projectId: String)
  /** GetResult implicit for fetching IssueCategoriesRow objects using plain SQL queries */
  implicit def GetResultIssueCategoriesRow(implicit e0: GR[Int], e1: GR[String]): GR[IssueCategoriesRow] = GR{
    prs => import prs._
    IssueCategoriesRow.tupled((<<[Int], <<[String], <<[String]))
  }
  /** Table description of table issue_categories. Objects of this class serve as prototypes for rows in queries. */
  class IssueCategories(_tableTag: Tag) extends profile.api.Table[IssueCategoriesRow](_tableTag, Some("portfolio"), "issue_categories") {
    def * = (id, name, projectId) <> (IssueCategoriesRow.tupled, IssueCategoriesRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = ((Rep.Some(id), Rep.Some(name), Rep.Some(projectId))).shaped.<>({r=>import r._; _1.map(_=> IssueCategoriesRow.tupled((_1.get, _2.get, _3.get)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column id SqlType(INT), AutoInc, PrimaryKey */
    val id: Rep[Int] = column[Int]("id", O.AutoInc, O.PrimaryKey)
    /** Database column name SqlType(VARCHAR), Length(32,true) */
    val name: Rep[String] = column[String]("name", O.Length(32,varying=true))
    /** Database column project_id SqlType(VARCHAR), Length(32,true) */
    val projectId: Rep[String] = column[String]("project_id", O.Length(32,varying=true))

    /** Foreign key referencing Projects (database name issue_categories_ibfk_1) */
    lazy val projectsFk = foreignKey("issue_categories_ibfk_1", projectId, Projects)(r => r.id, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Restrict)
  }
  /** Collection-like TableQuery object for table IssueCategories */
  lazy val IssueCategories = new TableQuery(tag => new IssueCategories(tag))

  /** Entity class storing rows of table Issues
   *  @param id Database column id SqlType(INT), AutoInc, PrimaryKey
   *  @param projectId Database column project_id SqlType(VARCHAR), Length(32,true)
   *  @param kind Database column kind SqlType(INT)
   *  @param status Database column status SqlType(INT)
   *  @param title Database column title SqlType(VARCHAR), Length(128,true)
   *  @param description Database column description SqlType(TEXT)
   *  @param assigneeId Database column assignee_id SqlType(VARCHAR), Length(64,true), Default(None)
   *  @param dueDate Database column due_date SqlType(DATETIME), Default(None)
   *  @param createdAt Database column created_at SqlType(DATETIME)
   *  @param updatedAt Database column updated_at SqlType(DATETIME)
   *  @param createdBy Database column created_by SqlType(VARCHAR), Length(64,true) */
  case class IssuesRow(id: Int, projectId: String, kind: Int, status: Int, title: String, description: String, assigneeId: Option[String] = None, dueDate: Option[java.sql.Timestamp] = None, createdAt: java.sql.Timestamp, updatedAt: java.sql.Timestamp, createdBy: String)
  /** GetResult implicit for fetching IssuesRow objects using plain SQL queries */
  implicit def GetResultIssuesRow(implicit e0: GR[Int], e1: GR[String], e2: GR[Option[String]], e3: GR[Option[java.sql.Timestamp]], e4: GR[java.sql.Timestamp]): GR[IssuesRow] = GR{
    prs => import prs._
    IssuesRow.tupled((<<[Int], <<[String], <<[Int], <<[Int], <<[String], <<[String], <<?[String], <<?[java.sql.Timestamp], <<[java.sql.Timestamp], <<[java.sql.Timestamp], <<[String]))
  }
  /** Table description of table issues. Objects of this class serve as prototypes for rows in queries. */
  class Issues(_tableTag: Tag) extends profile.api.Table[IssuesRow](_tableTag, Some("portfolio"), "issues") {
    def * = (id, projectId, kind, status, title, description, assigneeId, dueDate, createdAt, updatedAt, createdBy) <> (IssuesRow.tupled, IssuesRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = ((Rep.Some(id), Rep.Some(projectId), Rep.Some(kind), Rep.Some(status), Rep.Some(title), Rep.Some(description), assigneeId, dueDate, Rep.Some(createdAt), Rep.Some(updatedAt), Rep.Some(createdBy))).shaped.<>({r=>import r._; _1.map(_=> IssuesRow.tupled((_1.get, _2.get, _3.get, _4.get, _5.get, _6.get, _7, _8, _9.get, _10.get, _11.get)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column id SqlType(INT), AutoInc, PrimaryKey */
    val id: Rep[Int] = column[Int]("id", O.AutoInc, O.PrimaryKey)
    /** Database column project_id SqlType(VARCHAR), Length(32,true) */
    val projectId: Rep[String] = column[String]("project_id", O.Length(32,varying=true))
    /** Database column kind SqlType(INT) */
    val kind: Rep[Int] = column[Int]("kind")
    /** Database column status SqlType(INT) */
    val status: Rep[Int] = column[Int]("status")
    /** Database column title SqlType(VARCHAR), Length(128,true) */
    val title: Rep[String] = column[String]("title", O.Length(128,varying=true))
    /** Database column description SqlType(TEXT) */
    val description: Rep[String] = column[String]("description")
    /** Database column assignee_id SqlType(VARCHAR), Length(64,true), Default(None) */
    val assigneeId: Rep[Option[String]] = column[Option[String]]("assignee_id", O.Length(64,varying=true), O.Default(None))
    /** Database column due_date SqlType(DATETIME), Default(None) */
    val dueDate: Rep[Option[java.sql.Timestamp]] = column[Option[java.sql.Timestamp]]("due_date", O.Default(None))
    /** Database column created_at SqlType(DATETIME) */
    val createdAt: Rep[java.sql.Timestamp] = column[java.sql.Timestamp]("created_at")
    /** Database column updated_at SqlType(DATETIME) */
    val updatedAt: Rep[java.sql.Timestamp] = column[java.sql.Timestamp]("updated_at")
    /** Database column created_by SqlType(VARCHAR), Length(64,true) */
    val createdBy: Rep[String] = column[String]("created_by", O.Length(64,varying=true))

    /** Foreign key referencing Projects (database name issues_ibfk_1) */
    lazy val projectsFk = foreignKey("issues_ibfk_1", projectId, Projects)(r => r.id, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Restrict)
    /** Foreign key referencing Users (database name issues_ibfk_2) */
    lazy val usersFk2 = foreignKey("issues_ibfk_2", assigneeId, Users)(r => Rep.Some(r.id), onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Restrict)
    /** Foreign key referencing Users (database name issues_ibfk_3) */
    lazy val usersFk3 = foreignKey("issues_ibfk_3", createdBy, Users)(r => r.id, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Restrict)
  }
  /** Collection-like TableQuery object for table Issues */
  lazy val Issues = new TableQuery(tag => new Issues(tag))

  /** Entity class storing rows of table PlayEvolutions
   *  @param id Database column id SqlType(INT), PrimaryKey
   *  @param hash Database column hash SqlType(VARCHAR), Length(255,true)
   *  @param appliedAt Database column applied_at SqlType(TIMESTAMP)
   *  @param applyScript Database column apply_script SqlType(MEDIUMTEXT), Length(16777215,true), Default(None)
   *  @param revertScript Database column revert_script SqlType(MEDIUMTEXT), Length(16777215,true), Default(None)
   *  @param state Database column state SqlType(VARCHAR), Length(255,true), Default(None)
   *  @param lastProblem Database column last_problem SqlType(MEDIUMTEXT), Length(16777215,true), Default(None) */
  case class PlayEvolutionsRow(id: Int, hash: String, appliedAt: java.sql.Timestamp, applyScript: Option[String] = None, revertScript: Option[String] = None, state: Option[String] = None, lastProblem: Option[String] = None)
  /** GetResult implicit for fetching PlayEvolutionsRow objects using plain SQL queries */
  implicit def GetResultPlayEvolutionsRow(implicit e0: GR[Int], e1: GR[String], e2: GR[java.sql.Timestamp], e3: GR[Option[String]]): GR[PlayEvolutionsRow] = GR{
    prs => import prs._
    PlayEvolutionsRow.tupled((<<[Int], <<[String], <<[java.sql.Timestamp], <<?[String], <<?[String], <<?[String], <<?[String]))
  }
  /** Table description of table play_evolutions. Objects of this class serve as prototypes for rows in queries. */
  class PlayEvolutions(_tableTag: Tag) extends profile.api.Table[PlayEvolutionsRow](_tableTag, Some("portfolio"), "play_evolutions") {
    def * = (id, hash, appliedAt, applyScript, revertScript, state, lastProblem) <> (PlayEvolutionsRow.tupled, PlayEvolutionsRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = ((Rep.Some(id), Rep.Some(hash), Rep.Some(appliedAt), applyScript, revertScript, state, lastProblem)).shaped.<>({r=>import r._; _1.map(_=> PlayEvolutionsRow.tupled((_1.get, _2.get, _3.get, _4, _5, _6, _7)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column id SqlType(INT), PrimaryKey */
    val id: Rep[Int] = column[Int]("id", O.PrimaryKey)
    /** Database column hash SqlType(VARCHAR), Length(255,true) */
    val hash: Rep[String] = column[String]("hash", O.Length(255,varying=true))
    /** Database column applied_at SqlType(TIMESTAMP) */
    val appliedAt: Rep[java.sql.Timestamp] = column[java.sql.Timestamp]("applied_at")
    /** Database column apply_script SqlType(MEDIUMTEXT), Length(16777215,true), Default(None) */
    val applyScript: Rep[Option[String]] = column[Option[String]]("apply_script", O.Length(16777215,varying=true), O.Default(None))
    /** Database column revert_script SqlType(MEDIUMTEXT), Length(16777215,true), Default(None) */
    val revertScript: Rep[Option[String]] = column[Option[String]]("revert_script", O.Length(16777215,varying=true), O.Default(None))
    /** Database column state SqlType(VARCHAR), Length(255,true), Default(None) */
    val state: Rep[Option[String]] = column[Option[String]]("state", O.Length(255,varying=true), O.Default(None))
    /** Database column last_problem SqlType(MEDIUMTEXT), Length(16777215,true), Default(None) */
    val lastProblem: Rep[Option[String]] = column[Option[String]]("last_problem", O.Length(16777215,varying=true), O.Default(None))
  }
  /** Collection-like TableQuery object for table PlayEvolutions */
  lazy val PlayEvolutions = new TableQuery(tag => new PlayEvolutions(tag))

  /** Entity class storing rows of table Projects
   *  @param id Database column id SqlType(VARCHAR), PrimaryKey, Length(32,true)
   *  @param name Database column name SqlType(VARCHAR), Length(64,true) */
  case class ProjectsRow(id: String, name: String)
  /** GetResult implicit for fetching ProjectsRow objects using plain SQL queries */
  implicit def GetResultProjectsRow(implicit e0: GR[String]): GR[ProjectsRow] = GR{
    prs => import prs._
    ProjectsRow.tupled((<<[String], <<[String]))
  }
  /** Table description of table projects. Objects of this class serve as prototypes for rows in queries. */
  class Projects(_tableTag: Tag) extends profile.api.Table[ProjectsRow](_tableTag, Some("portfolio"), "projects") {
    def * = (id, name) <> (ProjectsRow.tupled, ProjectsRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = ((Rep.Some(id), Rep.Some(name))).shaped.<>({r=>import r._; _1.map(_=> ProjectsRow.tupled((_1.get, _2.get)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column id SqlType(VARCHAR), PrimaryKey, Length(32,true) */
    val id: Rep[String] = column[String]("id", O.PrimaryKey, O.Length(32,varying=true))
    /** Database column name SqlType(VARCHAR), Length(64,true) */
    val name: Rep[String] = column[String]("name", O.Length(64,varying=true))
  }
  /** Collection-like TableQuery object for table Projects */
  lazy val Projects = new TableQuery(tag => new Projects(tag))

  /** Entity class storing rows of table Users
   *  @param id Database column id SqlType(VARCHAR), PrimaryKey, Length(64,true)
   *  @param name Database column name SqlType(VARCHAR), Length(64,true)
   *  @param password Database column password SqlType(VARCHAR), Length(64,true)
   *  @param icon Database column icon SqlType(VARCHAR), Length(64,true), Default(None)
   *  @param currentProjectId Database column current_project_id SqlType(VARCHAR), Length(32,true)
   *  @param createdAt Database column created_at SqlType(DATETIME)
   *  @param updatedAt Database column updated_at SqlType(DATETIME) */
  case class UsersRow(id: String, name: String, password: String, icon: Option[String] = None, currentProjectId: String, createdAt: java.sql.Timestamp, updatedAt: java.sql.Timestamp)
  /** GetResult implicit for fetching UsersRow objects using plain SQL queries */
  implicit def GetResultUsersRow(implicit e0: GR[String], e1: GR[Option[String]], e2: GR[java.sql.Timestamp]): GR[UsersRow] = GR{
    prs => import prs._
    UsersRow.tupled((<<[String], <<[String], <<[String], <<?[String], <<[String], <<[java.sql.Timestamp], <<[java.sql.Timestamp]))
  }
  /** Table description of table users. Objects of this class serve as prototypes for rows in queries. */
  class Users(_tableTag: Tag) extends profile.api.Table[UsersRow](_tableTag, Some("portfolio"), "users") {
    def * = (id, name, password, icon, currentProjectId, createdAt, updatedAt) <> (UsersRow.tupled, UsersRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = ((Rep.Some(id), Rep.Some(name), Rep.Some(password), icon, Rep.Some(currentProjectId), Rep.Some(createdAt), Rep.Some(updatedAt))).shaped.<>({r=>import r._; _1.map(_=> UsersRow.tupled((_1.get, _2.get, _3.get, _4, _5.get, _6.get, _7.get)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column id SqlType(VARCHAR), PrimaryKey, Length(64,true) */
    val id: Rep[String] = column[String]("id", O.PrimaryKey, O.Length(64,varying=true))
    /** Database column name SqlType(VARCHAR), Length(64,true) */
    val name: Rep[String] = column[String]("name", O.Length(64,varying=true))
    /** Database column password SqlType(VARCHAR), Length(64,true) */
    val password: Rep[String] = column[String]("password", O.Length(64,varying=true))
    /** Database column icon SqlType(VARCHAR), Length(64,true), Default(None) */
    val icon: Rep[Option[String]] = column[Option[String]]("icon", O.Length(64,varying=true), O.Default(None))
    /** Database column current_project_id SqlType(VARCHAR), Length(32,true) */
    val currentProjectId: Rep[String] = column[String]("current_project_id", O.Length(32,varying=true))
    /** Database column created_at SqlType(DATETIME) */
    val createdAt: Rep[java.sql.Timestamp] = column[java.sql.Timestamp]("created_at")
    /** Database column updated_at SqlType(DATETIME) */
    val updatedAt: Rep[java.sql.Timestamp] = column[java.sql.Timestamp]("updated_at")

    /** Foreign key referencing Projects (database name users_ibfk_1) */
    lazy val projectsFk = foreignKey("users_ibfk_1", currentProjectId, Projects)(r => r.id, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Restrict)
  }
  /** Collection-like TableQuery object for table Users */
  lazy val Users = new TableQuery(tag => new Users(tag))

  /** Entity class storing rows of table XrefIssueIssueCategories
   *  @param issueId Database column issue_id SqlType(INT)
   *  @param categoryId Database column category_id SqlType(INT) */
  case class XrefIssueIssueCategoriesRow(issueId: Int, categoryId: Int)
  /** GetResult implicit for fetching XrefIssueIssueCategoriesRow objects using plain SQL queries */
  implicit def GetResultXrefIssueIssueCategoriesRow(implicit e0: GR[Int]): GR[XrefIssueIssueCategoriesRow] = GR{
    prs => import prs._
    XrefIssueIssueCategoriesRow.tupled((<<[Int], <<[Int]))
  }
  /** Table description of table xref_issue_issue_categories. Objects of this class serve as prototypes for rows in queries. */
  class XrefIssueIssueCategories(_tableTag: Tag) extends profile.api.Table[XrefIssueIssueCategoriesRow](_tableTag, Some("portfolio"), "xref_issue_issue_categories") {
    def * = (issueId, categoryId) <> (XrefIssueIssueCategoriesRow.tupled, XrefIssueIssueCategoriesRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = ((Rep.Some(issueId), Rep.Some(categoryId))).shaped.<>({r=>import r._; _1.map(_=> XrefIssueIssueCategoriesRow.tupled((_1.get, _2.get)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column issue_id SqlType(INT) */
    val issueId: Rep[Int] = column[Int]("issue_id")
    /** Database column category_id SqlType(INT) */
    val categoryId: Rep[Int] = column[Int]("category_id")

    /** Primary key of XrefIssueIssueCategories (database name xref_issue_issue_categories_PK) */
    val pk = primaryKey("xref_issue_issue_categories_PK", (issueId, categoryId))

    /** Foreign key referencing IssueCategories (database name xref_issue_issue_categories_ibfk_2) */
    lazy val issueCategoriesFk = foreignKey("xref_issue_issue_categories_ibfk_2", categoryId, IssueCategories)(r => r.id, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Restrict)
    /** Foreign key referencing Issues (database name xref_issue_issue_categories_ibfk_1) */
    lazy val issuesFk = foreignKey("xref_issue_issue_categories_ibfk_1", issueId, Issues)(r => r.id, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Restrict)
  }
  /** Collection-like TableQuery object for table XrefIssueIssueCategories */
  lazy val XrefIssueIssueCategories = new TableQuery(tag => new XrefIssueIssueCategories(tag))

  /** Entity class storing rows of table XrefUserProjects
   *  @param userId Database column user_id SqlType(VARCHAR), Length(64,true)
   *  @param projectId Database column project_id SqlType(VARCHAR), Length(32,true) */
  case class XrefUserProjectsRow(userId: String, projectId: String)
  /** GetResult implicit for fetching XrefUserProjectsRow objects using plain SQL queries */
  implicit def GetResultXrefUserProjectsRow(implicit e0: GR[String]): GR[XrefUserProjectsRow] = GR{
    prs => import prs._
    XrefUserProjectsRow.tupled((<<[String], <<[String]))
  }
  /** Table description of table xref_user_projects. Objects of this class serve as prototypes for rows in queries. */
  class XrefUserProjects(_tableTag: Tag) extends profile.api.Table[XrefUserProjectsRow](_tableTag, Some("portfolio"), "xref_user_projects") {
    def * = (userId, projectId) <> (XrefUserProjectsRow.tupled, XrefUserProjectsRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = ((Rep.Some(userId), Rep.Some(projectId))).shaped.<>({r=>import r._; _1.map(_=> XrefUserProjectsRow.tupled((_1.get, _2.get)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column user_id SqlType(VARCHAR), Length(64,true) */
    val userId: Rep[String] = column[String]("user_id", O.Length(64,varying=true))
    /** Database column project_id SqlType(VARCHAR), Length(32,true) */
    val projectId: Rep[String] = column[String]("project_id", O.Length(32,varying=true))

    /** Primary key of XrefUserProjects (database name xref_user_projects_PK) */
    val pk = primaryKey("xref_user_projects_PK", (userId, projectId))

    /** Foreign key referencing Projects (database name xref_user_projects_ibfk_2) */
    lazy val projectsFk = foreignKey("xref_user_projects_ibfk_2", projectId, Projects)(r => r.id, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Restrict)
    /** Foreign key referencing Users (database name xref_user_projects_ibfk_1) */
    lazy val usersFk = foreignKey("xref_user_projects_ibfk_1", userId, Users)(r => r.id, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Restrict)
  }
  /** Collection-like TableQuery object for table XrefUserProjects */
  lazy val XrefUserProjects = new TableQuery(tag => new XrefUserProjects(tag))
}
