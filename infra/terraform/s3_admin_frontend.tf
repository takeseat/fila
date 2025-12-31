# S3 Bucket for admin frontend
resource "aws_s3_bucket" "admin_web" {
  bucket_prefix = "${var.project_name}-admin-web-${var.environment}-"

  tags = {
    Name = "${var.project_name}-admin-web-${var.environment}"
  }
}

# S3 Bucket versioning
resource "aws_s3_bucket_versioning" "admin_web" {
  bucket = aws_s3_bucket.admin_web.id

  versioning_configuration {
    status = "Enabled"
  }
}

# S3 Bucket encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "admin_web" {
  bucket = aws_s3_bucket.admin_web.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Block public access
resource "aws_s3_bucket_public_access_block" "admin_web" {
  bucket = aws_s3_bucket.admin_web.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# S3 Bucket policy for CloudFront OAC
resource "aws_s3_bucket_policy" "admin_web" {
  bucket = aws_s3_bucket.admin_web.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipal"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.admin_web.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.admin_web.arn
          }
        }
      }
    ]
  })

  depends_on = [aws_cloudfront_distribution.admin_web]
}
