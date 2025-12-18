# Infraestrutura AWS - Fila

Infraestrutura serverless completa na AWS usando Terraform para o projeto Fila.

## 🏗️ Arquitetura

### Frontend
- **S3** bucket privado para arquivos estáticos
- **CloudFront** distribution com OAC (Origin Access Control)
- **ACM Certificate** em us-east-1 para CloudFront
- **Route53** records: `takeseat.me` e `www.takeseat.me`

### Backend
- **Lambda** functions (Node.js 20.x):
  - `takeseat-api-prod`: API principal
  - `takeseat-migrate-prod`: Execução de migrations
- **API Gateway** HTTP API com custom domain
- **ACM Certificate** regional para API Gateway
- **Route53** record: `api.takeseat.me`

### Database
- **Aurora Serverless v2** (MySQL 8.0)
  - Min capacity: 0.5 ACU
  - Max capacity: 2 ACU
  - Subnets privadas (2 AZs)
- **RDS Proxy** para gerenciar conexões Lambda
- **Secrets Manager** para credenciais

### Networking
- **VPC** (10.0.0.0/16)
- **Subnets públicas** (2 AZs) para NAT Gateway
- **Subnets privadas** (2 AZs) para Lambda, RDS Proxy e Aurora
- **NAT Gateway** para acesso internet das Lambdas
- **Security Groups** restritos (Lambda → RDS Proxy → Aurora)

### CI/CD
- **GitHub Actions** com OIDC (sem access keys)
- **IAM Role** com permissões mínimas necessárias

## 📋 Pré-requisitos

- AWS CLI configurado
- Terraform >= 1.0
- Conta AWS com permissões administrativas
- Domínio `takeseat.me` já configurado no Route53

## 🚀 Deploy da Infraestrutura

### 1. Inicializar Terraform

```bash
cd infra/terraform
terraform init
```

### 2. Revisar o Plano

```bash
terraform plan
```

### 3. Aplicar Infraestrutura

```bash
terraform apply
```

> ⚠️ **Atenção**: A criação completa leva ~15-20 minutos devido ao Aurora Serverless v2 e validação de certificados ACM.

### 4. Validar Certificados ACM

Os certificados ACM usam validação DNS automática via Route53. Terraform aguardará a validação completar.

### 5. Obter Outputs

```bash
terraform output
```

Outputs importantes:
- `github_actions_role_arn`: ARN do role para GitHub Actions
- `cloudfront_distribution_id`: ID da distribuição CloudFront
- `s3_bucket_name`: Nome do bucket S3
- `api_url`: URL da API
- `website_url`: URL do site

## ⚙️ Configurar GitHub Actions

### 1. Adicionar Secrets no GitHub

Vá em: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

Adicione:
- **Name**: `AWS_ROLE_ARN`
- **Value**: (copie o output `github_actions_role_arn` do Terraform)

### 2. Testar Deploy

Faça um commit e push para `main`:

```bash
git add .
git commit -m "feat: add AWS infrastructure"
git push origin main
```

O workflow será executado automaticamente.

## 🔍 Verificação

### Frontend

```bash
curl https://takeseat.me
curl https://www.takeseat.me
```

### Backend API

```bash
curl https://api.takeseat.me/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2024-..."
}
```

### Database

Verificar logs do Lambda migrations:

```bash
aws logs tail /aws/lambda/takeseat-migrate-prod --follow
```

## 💰 Custos Estimados

| Serviço | Custo Mensal (USD) |
|---------|-------------------|
| Aurora Serverless v2 (0.5-2 ACU) | $40-60 |
| RDS Proxy | $10 |
| Lambda (API + Migrations) | $5-10 |
| NAT Gateway | $32 |
| CloudFront | $1-5 |
| S3 | $1-2 |
| Route53 | $0.50 |
| **Total Estimado** | **$90-120/mês** |

> 💡 **Otimização**: Para reduzir custos em MVP, considere remover NAT Gateway se Lambda não precisar acessar internet (apenas DB via RDS Proxy).

## 🔧 Comandos Úteis

### Terraform

```bash
# Validar configuração
terraform validate

# Formatar arquivos
terraform fmt -recursive

# Ver estado atual
terraform show

# Destruir infraestrutura (CUIDADO!)
terraform destroy
```

### AWS CLI

```bash
# Listar Lambdas
aws lambda list-functions --query 'Functions[?starts_with(FunctionName, `takeseat`)].FunctionName'

# Invocar Lambda de migrations manualmente
aws lambda invoke --function-name takeseat-migrate-prod response.json

# Ver logs Lambda
aws logs tail /aws/lambda/takeseat-api-prod --follow

# Invalidar cache CloudFront
aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"

# Sync manual para S3
aws s3 sync ../frontend/dist/ s3://<bucket-name>/ --delete
```

## 🐛 Troubleshooting

### Lambda timeout conectando ao DB

- Verificar Security Groups (Lambda → RDS Proxy → Aurora)
- Verificar que Lambda está nas subnets privadas corretas
- Verificar logs do RDS Proxy no CloudWatch

### Certificado ACM não valida

- Verificar que Route53 hosted zone existe para `takeseat.me`
- Aguardar até 30 minutos para propagação DNS
- Verificar records de validação no Route53

### GitHub Actions falha no deploy

- Verificar que `AWS_ROLE_ARN` secret está configurado
- Verificar permissões do IAM role
- Verificar logs do workflow no GitHub

### CloudFront retorna 403

- Verificar bucket policy do S3
- Verificar que OAC está configurado corretamente
- Aguardar propagação do CloudFront (~15 min)

## 📚 Recursos

- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Aurora Serverless v2](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.html)
- [RDS Proxy](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html)
- [Lambda + VPC](https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc.html)
- [GitHub Actions OIDC](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)

## 🔐 Segurança

- ✅ Banco de dados em subnets privadas
- ✅ Sem acesso público ao Aurora
- ✅ Conexões Lambda via RDS Proxy
- ✅ Credenciais no Secrets Manager
- ✅ S3 bucket privado (acesso via CloudFront OAC)
- ✅ HTTPS obrigatório (TLS 1.2+)
- ✅ GitHub Actions via OIDC (sem access keys)
- ✅ IAM roles com least privilege

## 📝 Notas

- **Região**: us-east-1 (pode ser alterada em `variables.tf`)
- **Ambiente**: prod (pode criar staging duplicando com workspace Terraform)
- **Backup**: Aurora com retenção de 7 dias
- **Deletion Protection**: Desabilitado para MVP (habilitar em produção)
