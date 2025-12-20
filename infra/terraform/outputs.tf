output "lambda_api_function_name" {
  description = "Lambda API function name"
  value       = aws_lambda_function.api.function_name
}

output "lambda_api_function_arn" {
  description = "Lambda API function ARN"
  value       = aws_lambda_function.api.arn
}

output "lambda_migrate_function_name" {
  description = "Lambda migrations function name"
  value       = aws_lambda_function.migrate.function_name
}

output "api_gateway_url" {
  description = "API Gateway invoke URL"
  value       = aws_apigatewayv2_stage.default.invoke_url
}

output "api_custom_domain" {
  description = "API custom domain name"
  value       = "${var.api_subdomain}.${var.domain_name}"
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.web.id
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.web.domain_name
}

output "s3_bucket_name" {
  description = "S3 bucket name for frontend"
  value       = aws_s3_bucket.web.id
}

output "website_url" {
  description = "Website URL"
  value       = "https://${var.domain_name}"
}

output "api_url" {
  description = "API URL"
  value       = "https://${var.api_subdomain}.${var.domain_name}"
}

output "github_actions_role_arn" {
  description = "GitHub Actions OIDC role ARN"
  value       = aws_iam_role.github_actions.arn
}

output "aws_region" {
  description = "AWS region"
  value       = var.aws_region
}

output "aws_account_id" {
  description = "AWS account ID"
  value       = data.aws_caller_identity.current.account_id
}
