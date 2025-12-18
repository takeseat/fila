variable "project_name" {
  description = "Project name"
  type        = string
  default     = "takeseat"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "prod"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "domain_name" {
  description = "Root domain name"
  type        = string
  default     = "takeseat.me"
}

variable "api_subdomain" {
  description = "API subdomain"
  type        = string
  default     = "api"
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "public_subnet_cidrs" {
  description = "Public subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "Private subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.11.0/24", "10.0.12.0/24"]
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "fila"
}

variable "db_username" {
  description = "Database master username"
  type        = string
  default     = "admin"
}

variable "aurora_min_capacity" {
  description = "Aurora Serverless v2 minimum capacity (ACU)"
  type        = number
  default     = 0.5
}

variable "aurora_max_capacity" {
  description = "Aurora Serverless v2 maximum capacity (ACU)"
  type        = number
  default     = 2
}

variable "lambda_memory_api" {
  description = "Lambda API memory size (MB)"
  type        = number
  default     = 512
}

variable "lambda_memory_migrate" {
  description = "Lambda migrations memory size (MB)"
  type        = number
  default     = 1024
}

variable "lambda_timeout_api" {
  description = "Lambda API timeout (seconds)"
  type        = number
  default     = 30
}

variable "lambda_timeout_migrate" {
  description = "Lambda migrations timeout (seconds)"
  type        = number
  default     = 300
}

variable "github_repo" {
  description = "GitHub repository (owner/repo)"
  type        = string
  default     = "takeseat/fila"
}

variable "github_branch" {
  description = "GitHub branch for OIDC"
  type        = string
  default     = "main"
}
