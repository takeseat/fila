# DB Subnet Group for Aurora
resource "aws_db_subnet_group" "aurora" {
  name_prefix = "${var.project_name}-${var.environment}-aurora-"
  description = "Subnet group for Aurora cluster"
  subnet_ids  = aws_subnet.private[*].id

  tags = {
    Name = "${var.project_name}-${var.environment}-aurora-subnet-group"
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Aurora Cluster Parameter Group
resource "aws_rds_cluster_parameter_group" "aurora" {
  name_prefix = "${var.project_name}-${var.environment}-aurora-"
  family      = "aurora-mysql8.0"
  description = "Cluster parameter group for Aurora MySQL 8.0"

  parameter {
    name  = "character_set_server"
    value = "utf8mb4"
  }

  parameter {
    name  = "collation_server"
    value = "utf8mb4_unicode_ci"
  }

  parameter {
    name  = "time_zone"
    value = "America/Sao_Paulo"
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-aurora-cluster-pg"
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Aurora DB Parameter Group
resource "aws_db_parameter_group" "aurora" {
  name_prefix = "${var.project_name}-${var.environment}-aurora-db-"
  family      = "aurora-mysql8.0"
  description = "DB parameter group for Aurora MySQL 8.0"

  tags = {
    Name = "${var.project_name}-${var.environment}-aurora-db-pg"
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Aurora Serverless v2 Cluster
resource "aws_rds_cluster" "main" {
  cluster_identifier     = "${var.project_name}-${var.environment}-cluster"
  engine                 = "aurora-mysql"
  engine_mode            = "provisioned"
  engine_version         = "8.0.mysql_aurora.3.05.2"
  database_name          = var.db_name
  master_username        = var.db_username
  master_password        = random_password.db_password.result
  db_subnet_group_name   = aws_db_subnet_group.aurora.name
  vpc_security_group_ids = [aws_security_group.aurora.id]

  # Serverless v2 scaling configuration
  serverlessv2_scaling_configuration {
    min_capacity = var.aurora_min_capacity
    max_capacity = var.aurora_max_capacity
  }

  # Backup configuration
  backup_retention_period      = 7
  preferred_backup_window      = "03:00-04:00"
  preferred_maintenance_window = "mon:04:00-mon:05:00"

  # Encryption
  storage_encrypted = true

  # Parameter groups
  db_cluster_parameter_group_name = aws_rds_cluster_parameter_group.aurora.name

  # Deletion protection (set to true in production)
  deletion_protection = false
  skip_final_snapshot = true

  # Enable CloudWatch logs
  enabled_cloudwatch_logs_exports = ["error", "general", "slowquery"]

  tags = {
    Name = "${var.project_name}-${var.environment}-aurora-cluster"
  }

  depends_on = [
    aws_db_subnet_group.aurora,
    aws_security_group.aurora
  ]
}

# Aurora Serverless v2 Instance
resource "aws_rds_cluster_instance" "main" {
  identifier              = "${var.project_name}-${var.environment}-instance-1"
  cluster_identifier      = aws_rds_cluster.main.id
  instance_class          = "db.serverless"
  engine                  = aws_rds_cluster.main.engine
  engine_version          = aws_rds_cluster.main.engine_version
  db_parameter_group_name = aws_db_parameter_group.aurora.name

  # Performance Insights
  performance_insights_enabled = true

  tags = {
    Name = "${var.project_name}-${var.environment}-aurora-instance-1"
  }
}
