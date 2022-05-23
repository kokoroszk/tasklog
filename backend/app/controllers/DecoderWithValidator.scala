package controllers

import cats.implicits._

import io.circe.Decoder
import io.circe.generic.extras.Configuration

trait DecoderWithValidator[A] {
  implicit val customConfig: Configuration
  implicit val decoder: Decoder[A]

  def validations(x: A): List[Either[String, Unit]]
  def validation[V](name: String, value: V, b: V => Boolean*) =
    if (b.forall(f => f(value))) Right(())
    else Left(s"Invalid Argument. field: ${name}, value: ${value}")

  def validate(x: A) = for {
    _ <- validations(x).sequence
  } yield x

}
