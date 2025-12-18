# Security Group for Lambda functions
resource "aws_security_group" "lambda" {
  name_description = "${var.project_name}-${var.environment}-lambda-sg"
  description      = "Security group for Lambda functions"
  vpc_id           = aws_vpc.main.id

  # Egress to internet (via NAT) for external APIs, Secrets Manager, etc.
  egress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS to internet"
  }

  # Egress to RDS Proxy
  egress {
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.rds_proxy.id]
    description     = "MySQL to RDS Proxy"
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-lambda-sg"
  }
}

# Security Group for RDS Proxy
resource "aws_security_group" "rds_proxy" {
  name_prefix = "${var.project_name}-${var.environment}-rds-proxy-sg"
  description = "Security group for RDS Proxy"
  vpc_id      = aws_vpc.main.id

  # Inbound from Lambda
  ingress {
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.lambda.id]
    description     = "MySQL from Lambda"
  }

  # Egress to Aurora
  egress {
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.aurora.id]
    description     = "MySQL to Aurora"
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-rds-proxy-sg"
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Security Group for Aurora
resource "aws_security_group" "aurora" {
  name_prefix = "${var.project_name}-${var.environment}-aurora-sg"
  description = "Security group for Aurora cluster"
  vpc_id      = aws_vpc.main.id

  # Inbound from RDS Proxy only
  ingress {
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.rds_proxy.id]
    description     = "MySQL from RDS Proxy"
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-aurora-sg"
  }

  lifecycle {
    create_before_destroy = true
  }
}
