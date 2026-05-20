# Email Service Runbook

## Overview
This runbook provides operational procedures for managing AWS SES (Simple Email Service) for the TakeSeat application. SES is used to send verification emails during the signup process.

## Responsibilities
- Manage and monitor AWS SES v2 credentials and region identities.
- Verify DKIM, SPF, and DMARC record status to prevent message delivery blockages.
- Request production access to transition out of sandbox sending limits.

## Architecture / Flow
- **Service**: AWS SES v2 (Simple Email Service)
- **Region**: `us-east-1` (configurable via `SES_REGION`)
- **From Address**: `contato@takeseat.me` (configurable via `SES_FROM_EMAIL`)
- **Identity Type**: Domain-based (`takeseat.me`)
- **Authentication**: DKIM, SPF, DMARC

## Rules
- **DNS Verifications**: Ensure active DKIM, SPF, and DMARC settings match:
  - DKIM tokens match Route53 configuration targets.
  - SPF record: `"v=spf1 include:amazonses.com -all"`.
  - DMARC record: `"v=DMARC1; p=none; rua=mailto:dmarc@takeseat.me; fo=1"`.

## Edge Cases
- **Sandbox Sending Constraints**: In sandbox mode, emails can only be sent to verified addresses. Production migration is required to send emails to any recipient.
- **Access Denied Execution Error**: If backend Lambda executions fail to send messages, confirm that IAM execution policies grant `ses:SendEmail` and `ses:SendRawEmail` permissions.

## Technical Notes
- View send statistics using:
  ```bash
  aws cloudwatch get-metric-statistics --namespace AWS/SES --metric-name Send --dimensions Name=Environment,Value=prod --start-time 2024-01-01T00:00:00Z --end-time 2024-01-02T00:00:00Z --period 3600 --statistics Sum --region us-east-1
  ```

## Related Documents
- [System Architecture Overview](../architecture/overview.md)
- [Security Overview](../security/security-overview.md)
