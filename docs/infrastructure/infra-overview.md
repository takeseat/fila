# Infrastructure Overview

## Overview
TakeSeat infrastructure is designed as a cost-effective, high-availability Serverless architecture on Amazon Web Services (AWS), fully managed via Terraform Infrastructure as Code (IaC).

## Responsibilities
- **Compute Hosting**: AWS Lambda runs backend API handlers and DB migration runners.
- **Relational Storage**: Amazon Aurora Serverless v2 MySQL manages data persistence.
- **Static Assets Delivery**: Amazon S3 hosts React frontend build files, fronted by Amazon CloudFront CDN.

## Architecture / Flow
- **Request Routing Path**:
  1. Client operator access -> queries CloudFront CDN -> serves React files cached from S3 bucket.
  2. Client API request -> routes to AWS API Gateway -> triggers API Lambda execution.
  3. API Lambda -> queries Aurora Serverless v2 DB cluster over MySQL protocol.
  4. Outbound API requests (e.g. Z-API WhatsApp notifications) -> Lambda forwards directly to public internet routes.

## Rules
- **Serverless Compute Mode**: All operations utilize lambda execution models. No persistent virtual servers (EC2 instances) are used.
- **Infrastructure as Code**: Any modifications to AWS resources (S3 buckets, security group settings, DNS routing) must be declared in Terraform configuration files located in `infra/terraform/`. Manual edits via AWS Web Console are prohibited.

## Edge Cases
- **VPC Bypass for NAT Avoidance**: Backend Lambda functions run outside the private VPC network. This enables direct access to external APIs (Z-API WhatsApp gateway) and database clusters without incurring AWS NAT Gateway operational costs. Security is enforced via MySQL strong password encryption and strict database IP security groups.

## Technical Notes
- Runtime platform: Node.js 20.x on Amazon Linux 2023.
- Database credentials: Sync is handled using AWS Secrets Manager.

## Related Documents
- [Deployment Guide](./deployment.md)
- [Backend Architecture](../backend/backend-architecture.md)
