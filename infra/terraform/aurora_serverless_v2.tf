# DB Subnet Group - using public subnets for MVP
resource "aws_db_subnet_group" "main" {
  name_prefix = "${var.project_name}-${var.environment}-"
  description = "Database subnet group for ${var.project_name}"
  subnet_ids  = aws_subnet.public[*].id

  tags = {
    Name = "${var.project_name}-${var.environment}"
  }
}

# Aurora Cluster Parameter Group
resource "aws_rds_cluster_parameter_group" "main" {
  name_prefix = "${var.project_name}-${var.environment}-cluster-"
  family      = "aurora-mysql8.0"
  description = "Cluster parameter group for ${var.project_name}"

  parameter {
    name  = "character_set_server"
    value = "utf8mb4"
  }

  parameter {
    name  = "collation_server"
    value = "utf8mb4_unicode_ci"
  }

  parameter {
    name  = "max_connections"
    value = "1000"
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-cluster"
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Aurora DB Parameter Group
resource "aws_db_parameter_group" "main" {
  name_prefix = "${var.project_name}-${var.environment}-db-"
  family      = "aurora-mysql8.0"
  description = "DB parameter group for ${var.project_name}"

  tags = {
    Name = "${var.project_name}-${var.environment}-db"
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Aurora Serverless v2 Cluster
resource "aws_rds_cluster" "main" {
  cluster_identifier     = "${var.project_name}-${var.environment}"
  engine                 = "aurora-mysql"
  engine_version         = "8.0.mysql_aurora.3.11.1"
  engine_mode            = "provisioned"
  database_name          = var.db_name
  master_username        = var.db_username
  master_password        = random_password.db_password.result
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.aurora.id]

  # Serverless v2 scaling configuration
  serverlessv2_scaling_configuration {
    min_capacity = 0.5
    max_capacity = 2.0
  }

  # Backup configuration
  backup_retention_period      = 7
  preferred_backup_window      = "03:00-04:00"
  preferred_maintenance_window = "mon:04:00-mon:05:00"

  # Encryption
  storage_encrypted = true
  # Using AWS managed key instead of custom KMS key to avoid permission issues

  # High availability
  enabled_cloudwatch_logs_exports = ["error", "general", "slowquery"]

  # Parameter groups
  db_cluster_parameter_group_name = aws_rds_cluster_parameter_group.main.name

  # Deletion protection
  deletion_protection = false # Set to true in production
  skip_final_snapshot = true  # Set to false in production

  tags = {
    Name = "${var.project_name}-${var.environment}"
  }

  depends_on = [aws_secretsmanager_secret_version.db_credentials]
}

# Aurora Serverless v2 Instance (Primary)
resource "aws_rds_cluster_instance" "primary" {
  identifier              = "${var.project_name}-${var.environment}-1"
  cluster_identifier      = aws_rds_cluster.main.id
  instance_class          = "db.serverless"
  engine                  = aws_rds_cluster.main.engine
  engine_version          = "8.0.mysql_aurora.3.11.1"
  db_parameter_group_name = aws_db_parameter_group.main.name
  publicly_accessible     = true

  performance_insights_enabled = true

  tags = {
    Name = "${var.project_name}-${var.environment}-primary"
  }
}


