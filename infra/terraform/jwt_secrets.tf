# Random password for JWT secret
resource "random_password" "jwt_secret" {
  length  = 32
  special = false
}

# Random password for JWT refresh secret
resource "random_password" "jwt_refresh_secret" {
  length  = 32
  special = false
}
