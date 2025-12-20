# IAM Role for Lambda functions
resource "aws_lambda_function" "api" {
  function_name = "${var.project_name}-api-${var.environment}"
  role          = aws_iam_role.lambda.arn
  handler       = "dist/lambda.handler"
  runtime       = "nodejs20.x"
  timeout       = var.lambda_timeout_api
  memory_size   = var.lambda_memory_api

  # Placeholder code (will be updated by CI/CD)
  filename         = "${path.module}/lambda_placeholder.zip"
  source_code_hash = filebase64sha256("${path.module}/lambda_placeholder.zip")

  environment {
    variables = {
      NODE_ENV    = "production"
      CORS_ORIGIN = "https://${var.domain_name}"
    }
  }

  tags = {
    Name = "${var.project_name}-api-${var.environment}"
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic
  ]
}

# IAM Role for Lambda
resource "aws_iam_role" "lambda" {
  name_prefix = "${var.project_name}-${var.environment}-lambda-"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-${var.environment}-lambda-role"
  }
}

# Attach AWS managed policy for basic execution
resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Lambda function for migrations
resource "aws_lambda_function" "migrate" {
  function_name = "${var.project_name}-migrate-${var.environment}"
  role          = aws_iam_role.lambda.arn
  handler       = "dist/migrate.handler"
  runtime       = "nodejs20.x"
  timeout       = var.lambda_timeout_migrate
  memory_size   = var.lambda_memory_migrate

  # Placeholder code (will be updated by CI/CD)
  filename         = "${path.module}/lambda_placeholder.zip"
  source_code_hash = filebase64sha256("${path.module}/lambda_placeholder.zip")

  environment {
    variables = {
      NODE_ENV = "production"
    }
  }

  tags = {
    Name = "${var.project_name}-migrate-${var.environment}"
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic
  ]
}

# CloudWatch Log Group for API Lambda
resource "aws_cloudwatch_log_group" "lambda_api" {
  name              = "/aws/lambda/${aws_lambda_function.api.function_name}"
  retention_in_days = 7

  tags = {
    Name = "${var.project_name}-api-${var.environment}-logs"
  }
}

# CloudWatch Log Group for Migrate Lambda
resource "aws_cloudwatch_log_group" "lambda_migrate" {
  name              = "/aws/lambda/${aws_lambda_function.migrate.function_name}"
  retention_in_days = 7

  tags = {
    Name = "${var.project_name}-migrate-${var.environment}-logs"
  }
}
