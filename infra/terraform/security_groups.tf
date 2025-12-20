# Lambda Security Group
resource "aws_security_group" "lambda" {
  name_prefix = "${var.project_name}-${var.environment}-lambda-"
  description = "Security group for Lambda functions"
  vpc_id      = aws_vpc.main.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-lambda"
  }

  lifecycle {
    create_before_destroy = true
  }
}

# RDS Proxy Security Group
resource "aws_security_group" "rds_proxy" {
  name_prefix = "${var.project_name}-${var.environment}-rds-proxy-"
  description = "Security group for RDS Proxy"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.lambda.id]
    description     = "MySQL from Lambda"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-rds-proxy"
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Aurora Security Group
resource "aws_security_group" "aurora" {
  name_prefix = "${var.project_name}-${var.environment}-aurora-"
  description = "Security group for Aurora cluster"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.rds_proxy.id]
    description     = "MySQL from RDS Proxy"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-aurora"
  }

  lifecycle {
    create_before_destroy = true
  }
}
