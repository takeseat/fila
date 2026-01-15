# SES Email Identity for takeseat.me domain
resource "aws_sesv2_email_identity" "domain" {
  provider = aws.no_tags
  
  email_identity = var.domain_name

  configuration_set_name = aws_sesv2_configuration_set.main.configuration_set_name

  dkim_signing_attributes {
    next_signing_key_length = "RSA_2048_BIT"
  }

  lifecycle {
    ignore_changes = [tags, tags_all]
  }
}

# SES Configuration Set for tracking and reputation management
resource "aws_sesv2_configuration_set" "main" {
  provider = aws.no_tags
  
  configuration_set_name = "${var.project_name}-${var.environment}"

  reputation_options {
    reputation_metrics_enabled = true
  }

  sending_options {
    sending_enabled = true
  }

  lifecycle {
    ignore_changes = [tags, tags_all]
  }
}

# SES Event Destination for bounce/complaint tracking (optional but recommended)
resource "aws_sesv2_configuration_set_event_destination" "cloudwatch" {
  configuration_set_name = aws_sesv2_configuration_set.main.configuration_set_name
  event_destination_name = "cloudwatch-metrics"

  event_destination {
    enabled = true

    matching_event_types = [
      "SEND",
      "REJECT",
      "BOUNCE",
      "COMPLAINT",
      "DELIVERY",
      "OPEN",
      "CLICK"
    ]

    cloud_watch_destination {
      dimension_configuration {
        default_dimension_value = var.environment
        dimension_name          = "Environment"
        dimension_value_source  = "MESSAGE_TAG"
      }

      dimension_configuration {
        default_dimension_value = "verification"
        dimension_name          = "EmailType"
        dimension_value_source  = "MESSAGE_TAG"
      }
    }
  }
}
