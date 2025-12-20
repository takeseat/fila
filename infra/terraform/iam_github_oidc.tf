# GitHub OIDC Provider
resource "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"

  client_id_list = ["sts.amazonaws.com"]

  thumbprint_list = [
    "6938fd4d98bab03faadb97b34396831e3780aea1",
    "1c58a3a8518e8759bf075b76b750d4f2df264fcd"
  ]

  tags = {
    Name = "${var.project_name}-${var.environment}-github-oidc"
  }
}

# IAM Role for GitHub Actions
resource "aws_iam_role" "github_actions" {
  name_prefix = "${var.project_name}-${var.environment}-github-actions-"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = aws_iam_openid_connect_provider.github.arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }
          StringLike = {
            "token.actions.githubusercontent.com:sub" = "repo:${var.github_repo}:ref:refs/heads/${var.github_branch}"
          }
        }
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-${var.environment}-github-actions-role"
  }
}

# IAM Policy for GitHub Actions
resource "aws_iam_role_policy" "github_actions" {
  name_prefix = "${var.project_name}-${var.environment}-github-actions-"
  role        = aws_iam_role.github_actions.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      # Lambda permissions
      {
        Effect = "Allow"
        Action = [
          "lambda:UpdateFunctionCode",
          "lambda:UpdateFunctionConfiguration",
          "lambda:InvokeFunction",
          "lambda:GetFunction"
        ]
        Resource = [
          aws_lambda_function.api.arn,
          aws_lambda_function.migrate.arn
        ]
      },
      # S3 permissions for frontend
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.web.arn,
          "${aws_s3_bucket.web.arn}/*"
        ]
      },
      # CloudFront invalidation
      {
        Effect = "Allow"
        Action = [
          "cloudfront:CreateInvalidation",
          "cloudfront:GetInvalidation"
        ]
        Resource = aws_cloudfront_distribution.web.arn
      }
    ]
  })
}
