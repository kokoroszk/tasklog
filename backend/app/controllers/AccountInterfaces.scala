package controllers

import io.circe.Decoder
import io.circe.generic.extras.Configuration
import io.circe.generic.extras.semiauto.deriveConfiguredDecoder

final case class SignUpRequest(id: String, password: String, name: String);
final case class SignInRequest(id: String, password: String);

object SignUpRequest extends DecoderWithValidator[SignUpRequest] {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val decoder: Decoder[SignUpRequest] = deriveConfiguredDecoder[SignUpRequest].emap(validate)

  override def validations(x: SignUpRequest) = List(
    validation[String]("name", x.id,
      _.nonEmpty,
      _.length < 32,
      _.forall(_.isLetterOrDigit)),
    validation[String]("password", x.password,
      _.nonEmpty,
      _.length < 32,
      _.length > 7,
      _.forall(_.isLetterOrDigit))
  )
}

object SignInRequest extends DecoderWithValidator[SignInRequest] {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val decoder: Decoder[SignInRequest] = deriveConfiguredDecoder[SignInRequest].emap(validate)
  override def validations(x: SignInRequest) = List(
    validation[String]("id", x.id, _.nonEmpty),
    validation[String]("password", x.password, _.nonEmpty),
  )
}
