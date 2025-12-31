# CloudFront Origin Access Control for Admin Portal
resource "aws_cloudfront_origin_access_control" "admin_web" {
  name                              = "${var.project_name}-admin-${var.environment}-oac"
  description                       = "OAC for ${var.project_name} Admin Portal S3 bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# CloudFront Distribution for Admin Portal
resource "aws_cloudfront_distribution" "admin_web" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100" # US, Canada, Europe
  aliases             = ["admin.${var.domain_name}"]

  origin {
    domain_name              = aws_s3_bucket.admin_web.bucket_regional_domain_name
    origin_id                = "S3-${aws_s3_bucket.admin_web.id}"
    origin_access_control_id = aws_cloudfront_origin_access_control.admin_web.id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.admin_web.id}"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 3600
    max_ttl     = 86400
  }

  # Custom error response for SPA routing
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.cloudfront.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  tags = {
    Name = "${var.project_name}-admin-${var.environment}-cloudfront"
  }

  depends_on = [aws_acm_certificate_validation.cloudfront]
}

# Route53 record for admin subdomain
resource "aws_route53_record" "admin_web" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "admin.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.admin_web.domain_name
    zone_id                = aws_cloudfront_distribution.admin_web.hosted_zone_id
    evaluate_target_health = false
  }
}
