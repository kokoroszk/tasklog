-- issue manage schema

-- !Ups

create table projects(
  id varchar(32) primary key,
  name varchar(64) not null
);

create table users(
  id varchar(64) primary key,
  name varchar(64) not null,
  password varchar(64) not null,
  icon varchar(64),
  current_project_id varchar(32) not null,
  created_at datetime not null,
  updated_at datetime not null,
  foreign key fk_project_id (current_project_id) references projects (id)
);

create table issues(
  id int auto_increment primary key,
  project_id varchar(32) not null,
  kind int not null,
  status int not null,
  title varchar(128) not null,
  description text not null,
  assignee_id varchar(64),
  due_date datetime,
  created_at datetime not null,
  updated_at datetime not null,
  created_by varchar(64) not null,
  foreign key fk_project_id (project_id) references projects (id),
  foreign key fk_assignee_id (assignee_id) references users (id),
  foreign key fk_created_by (created_by) references users (id)
);

create table xref_user_projects(
  user_id varchar(64) not null,
  project_id varchar(32) not null,
  primary key pk_user_id_project_id (user_id, project_id),
  foreign key fk_user_id (user_id) references users (id),
  foreign key fk_project_id (project_id) references projects (id)
);

create table issue_categories(
  id int auto_increment primary key,
  name varchar(32) not null,
  project_id varchar(32) not null,
  foreign key fk_project_id (project_id) references projects (id)
);

create table xref_issue_issue_categories(
  issue_id int not null,
  category_id int not null,
  primary key pk_issue_id_category_id (issue_id, category_id),
  foreign key fk_issue_id (issue_id) references issues (id),
  foreign key fk_category_id (category_id) references issue_categories (id)
);

create table change_logs(
  id int auto_increment primary key,
  project_id varchar(32) not null,
  issue_id int not null,
  kind int not null,
  comment text not null,
  status int not null,
  assignee_id varchar(64),
  due_date datetime,
  created_at datetime not null,
  created_by varchar(64) not null,
  index idx_project_id_created_at(project_id, created_at),
  foreign key fk_issue_id (issue_id) references issues (id),
  foreign key fk_project_id (project_id) references projects (id),
  foreign key fk_assignee_id (assignee_id) references users (id),
  foreign key fk_created_by (created_by) references users (id)
);

-- data
insert into projects values
("SAMPLE", "サンプルプロジェクト"),
("TEST", "試験プロジェクト"),
("DUMMY", "DUMMY PROJECT")
;

insert into issue_categories values
(1, "テストカテゴリ", "SAMPLE"),
(2, "sample-category", "SAMPLE")
;


insert into users values
("testuser1", "鈴木 心", "$2a$10$Cnzisj.qk0e7BKUaMPMau.dzdUNLEsuyEZpYzwuEyuYRtuVaI2d82", NULL, "SAMPLE", now(), now()),
("testuser2", "鈴木 心太", "$2a$10$S.irAVtn9c.i7mX.oKhnFODyQtqDqpOc4l5qnyLQFux0wsIxNuC82", NULL, "SAMPLE", now(), now()),
("testuser3", "鈴木 志", "$2a$10$bUcDQchEpVoWUNveyiN9bOQmmCNKSPtbiEqQwyzP5zIjG0tSEn0my", NULL, "SAMPLE", now(), now())
;

insert into xref_user_projects values
("testuser1", "SAMPLE"),
("testuser2", "SAMPLE"),
("testuser3", "SAMPLE")
;

insert into issues values
(1,"SAMPLE",1,1,"title","description","testuser1",now(),now(),now(),"testuser1"),
(2,"SAMPLE",2,2,"title","description","testuser1",now(),now(),now(),"testuser2"),
(3,"SAMPLE",3,3,"title","description","testuser1",now(),now(),now(),"testuser3")
;

insert into xref_issue_issue_categories values
(1, 1),
(2, 1),
(2, 2)
;

insert into change_logs values
(1, "SAMPLE", 1, 0, '# sample comment 1-1', 1, "testuser1", null, now(), "testuser1"),
(2, "SAMPLE", 1, 1, '# sample comment 1-2', 2, "testuser1", now(), now(), "testuser1"),
(3, "SAMPLE", 1, 1, '# sample comment 1-2', 3, null, now(), now(), "testuser1"),
(4, "SAMPLE", 2, 0, '# sample comment 2-1', 1, null, now(), now(), "testuser1"),
(5, "TEST", 1, 0, '# test comment 2-1', 1, null, now(), now(), "testUser1")
;


-- !Downs

drop table xref_issue_issue_categories, issue_categories, issues, xref_user_projects, users, projects, change_logs;
