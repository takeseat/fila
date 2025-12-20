# Random password for database
resource "random_password" "db_password" {
  length  = 32
  special = true
}

# Secrets Manager secret for database credentials
resource "aws_secretsmanager_secret" "db_credentials" {
  name_prefix             = "${var.project_name}-${var.environment}-db-"
  description             = "Database credentials for ${var.project_name}"
  recovery_window_in_days = 7

  tags = {
    Name = "${var.project_name}-${var.environment}-db-credentials"
  }
}

# Secret version with actual credentials
resource "aws_secretsmanager_secret_version" "db_credentials" {
  secret_id = aws_secretsmanager_secret.db_credentials.id
  secret_string = jsonencode({
    username = var.db_username
    password = random_password.db_password.result
    engine   = "mysql"
    port     = 3306
    dbname   = var.db_name
  })
}
