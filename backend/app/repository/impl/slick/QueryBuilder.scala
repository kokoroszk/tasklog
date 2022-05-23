package repository.impl.slick

import cats.data.State
import org.joda.time.DateTime
import slick.ast.BaseTypedType
import slick.jdbc.MySQLProfile.api._
import slick.lifted.{AbstractTable, Query, Rep}

import java.sql.Timestamp
import scala.language.implicitConversions


object QueryBuilder {

  // types for condition
  type In[A] = Option[Seq[A]]

  // types for TableQueryState
  type QueryType[E <: AbstractTable[_]] = Query[E, E#TableElementType, Seq]
  type StateType[E <: AbstractTable[_]] = State[QueryType[E], Boolean]
  type StateCons[E <: AbstractTable[_]] = (QueryType[E] => (QueryType[E], Boolean)) => StateType[E]

  def StateCons[E <: AbstractTable[_]]: StateCons[E] = State[QueryType[E], Boolean] _

  // utilities
  def toSqlTimestamp(dt: DateTime) = new Timestamp(dt.getMillis)
  def toDateTime(ts: Timestamp) = new DateTime(ts.getTime)
  def currentTimestamp = toSqlTimestamp(DateTime.now)

  implicit def value2ConditionOps[A: BaseTypedType, E <: AbstractTable[_]](value: E => Rep[A]): ConditionOps[A, E] =
    new ConditionOps(value)

  final class ConditionOps[A: BaseTypedType, E <: AbstractTable[_]](v: E => Rep[A]) {

    def in(condition: In[A]): StateType[E] = StateCons[E] {
      query =>
        condition match {
          case Some(condition) => (query.filter(v(_) inSet condition), true)
          case None => (query, false)
        }
    }

    def ===(condition: Option[A]): StateType[E] = StateCons[E] {
      query =>
        condition match {
          case Some(condition) => (query.filter(v(_) === condition), true)
          case None => (query, false)
        }
    }


    def >=(condition: Option[A]): StateType[E] = StateCons[E] {
      query =>
        condition match {
          case Some(condition) => (query.filter(v(_) >= condition), true)
          case None => (query, false)
        }
    }

    def <=(condition: Option[A]): StateType[E] = StateCons[E] {
      query =>
        condition match {
          case Some(condition) => (query.filter(v(_) <= condition), true)
          case None => (query, false)
        }
    }
  }


  implicit def value2OptionIntConditionOps[A: BaseTypedType, E <: AbstractTable[_]](value: E => Rep[Option[A]])
  : OptionConditionOps[A, E] =
    new OptionConditionOps(value)

  final class OptionConditionOps[A: BaseTypedType, E <: AbstractTable[_]](v: E => Rep[Option[A]]) {
    def in(condition: In[A]): StateType[E] = StateCons[E] {
      query =>
        condition match {
          case Some(condition) => (query.filter(v(_) inSet condition), true)
          case None => (query, false)
        }
    }

    def >=(condition: Option[A]): StateType[E] = StateCons[E] {
      query =>
        condition match {
          case Some(condition) => (query.filter(v(_) >= condition), true)
          case None => (query, false)
        }
    }

    def <=(condition: Option[A]): StateType[E] = StateCons[E] {
      query =>
        condition match {
          case Some(condition) => (query.filter(v(_) <= condition), true)
          case None => (query, false)
        }
    }
  }

  def addLimit[E <: AbstractTable[_]](limit: Option[Int]): StateType[E] = StateCons[E] {
    query => limit match {
      case Some(n) => (query.take(n), true)
      case None => (query, false)
    }
  }

  def addCondition[E <: AbstractTable[_]](f: QueryType[E] => Option[QueryType[E]]): StateType[E] =
    StateCons[E] {
      query =>
        f(query) match {
          case Some(newQuery) => (newQuery, true)
          case None => (query, false)
        }
    }

  def addNothing[E <: AbstractTable[_]]: StateType[E] = StateCons[E] {(_, false)}
}