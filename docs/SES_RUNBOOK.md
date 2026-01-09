# SES Email Service - Operational Runbook

## Overview

This runbook provides operational procedures for managing AWS SES (Simple Email Service) for the TakeSeat application. SES is used to send verification emails during the signup process.

---

## Architecture

- **Service**: AWS SES v2 (Simple Email Service)
- **Region**: `us-east-1` (configurable via `SES_REGION`)
- **From Address**: `contato@takeseat.me` (configurable via `SES_FROM_EMAIL`)
- **Identity Type**: Domain-based (`takeseat.me`)
- **Authentication**: DKIM, SPF, DMARC

---

## Checking SES Status

### 1. Verify Email Identity Status

```bash
aws sesv2 get-email-identity \
  --email-identity takeseat.me \
  --region us-east-1
```

**Expected Output:**
```json
{
  "IdentityType": "DOMAIN",
  "VerifiedForSendingStatus": true,
  "DkimAttributes": {
    "SigningEnabled": true,
    "Status": "SUCCESS",
    "Tokens": ["token1", "token2", "token3"]
  }
}
```

**Key Fields:**
- `VerifiedForSendingStatus`: Must be `true` to send emails
- `DkimAttributes.Status`: Should be `SUCCESS` for proper authentication

### 2. Check Account Sending Status

```bash
aws sesv2 get-account --region us-east-1
```

**Important Fields:**
- `ProductionAccessEnabled`: `true` = can send to any email, `false` = sandbox mode
- `SendingEnabled`: Must be `true`

**Sandbox Mode Limitations:**
- Can only send to verified email addresses
- Maximum 200 emails per 24 hours
- Maximum 1 email per second

---

## DNS Verification

### 1. Check DKIM Records

```bash
# Get DKIM tokens from Terraform output
terraform output ses_dkim_tokens

# Verify DNS propagation
dig +short <token1>._domainkey.takeseat.me CNAME
dig +short <token2>._domainkey.takeseat.me CNAME
dig +short <token3>._domainkey.takeseat.me CNAME
```

**Expected:** Each should return `<token>.dkim.amazonses.com`

### 2. Check SPF Record

```bash
dig +short takeseat.me TXT | grep spf
```

**Expected:** `"v=spf1 include:amazonses.com -all"`

### 3. Check DMARC Record

```bash
dig +short _dmarc.takeseat.me TXT
```

**Expected:** `"v=DMARC1; p=none; rua=mailto:dmarc@takeseat.me; fo=1"`

---

## Testing Email Sending

### 1. Test via AWS CLI

```bash
aws sesv2 send-email \
  --from-email-address contato@takeseat.me \
  --destination ToAddresses=your-test-email@example.com \
  --content "Simple={Subject={Data='Test Email',Charset=utf8},Body={Text={Data='This is a test',Charset=utf8}}}" \
  --region us-east-1
```

**Success Response:**
```json
{
  "MessageId": "01000123456789ab-cdef0123-4567-89ab-cdef-0123456789ab-000000"
}
```

### 2. Test via Application (Local)

```bash
cd backend
export SES_FROM_EMAIL=contato@takeseat.me
export SES_REGION=us-east-1
export AWS_REGION=us-east-1

# Start the backend
npm run dev

# Trigger signup via API
curl -X POST http://localhost:3000/api/auth/signup-email \
  -H "Content-Type: application/json" \
  -d '{"userEmail":"test@example.com"}'
```

**Check Logs:**
```
[EmailService] Initialized with region=us-east-1, from=contato@takeseat.me
[EmailService] ✓ Verification email sent successfully {
  correlationId: 'uuid-here',
  messageId: 'ses-message-id',
  region: 'us-east-1',
  from: 'contato@takeseat.me'
}
```

---

## Troubleshooting

### Error: "MessageRejected"

**Cause:** Email identity not verified or sandbox restrictions

**Solution:**
1. Check identity status: `aws sesv2 get-email-identity --email-identity takeseat.me`
2. Verify DNS records are propagated (can take up to 48 hours)
3. If in sandbox, verify recipient email or request production access

### Error: "MailFromDomainNotVerifiedException"

**Cause:** DKIM/SPF records not configured or not propagated

**Solution:**
1. Verify DKIM records: `dig +short <token>._domainkey.takeseat.me CNAME`
2. Wait for DNS propagation (up to 48 hours)
3. Check Route53 records match Terraform output

### Error: "AccessDenied"

**Cause:** Lambda execution role lacks SES permissions

**Solution:**
1. Check IAM policy in `infra/terraform/lambda.tf`
2. Verify policy includes `ses:SendEmail` and `ses:SendRawEmail`
3. Confirm resource ARN matches SES identity ARN

### Error: "AccountSendingPausedException"

**Cause:** AWS has paused sending (usually due to bounce/complaint rate)

**Solution:**
1. Check SES reputation metrics in AWS Console
2. Review bounce/complaint rates
3. Contact AWS Support if needed

---

## Requesting Production Access

If the account is in **sandbox mode** and you need to send to any email address:

1. **AWS Console** → SES → Account dashboard
2. Click **Request production access**
3. Fill out the form:
   - **Mail Type**: Transactional
   - **Website URL**: https://takeseat.me
   - **Use Case**: User email verification for restaurant waitlist management
   - **Compliance**: Confirm double opt-in (email verification)
   - **Bounce/Complaint Handling**: Describe monitoring via CloudWatch
4. Submit request (usually approved within 24 hours)

---

## Monitoring

### CloudWatch Metrics

SES automatically publishes metrics to CloudWatch:

```bash
# View send metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/SES \
  --metric-name Send \
  --dimensions Name=Environment,Value=prod \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 3600 \
  --statistics Sum \
  --region us-east-1
```

**Key Metrics:**
- `Send`: Total emails sent
- `Delivery`: Successfully delivered
- `Bounce`: Hard/soft bounces
- `Complaint`: Spam complaints
- `Reject`: Rejected by SES (invalid recipient, etc.)

### CloudWatch Logs

Lambda logs include SES correlation IDs:

```bash
aws logs tail /aws/lambda/takeseat-api-prod --follow --region us-east-1
```

**Look for:**
- `[EmailService] ✓ Verification email sent successfully` → Success
- `[EmailService] ✗ SES API Error` → Failure with error details

---

## Environment Variables

Required environment variables for the backend:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `SES_REGION` | AWS region for SES | `us-east-1` | No |
| `SES_FROM_EMAIL` | Sender email address | `contato@takeseat.me` | No |
| `AWS_REGION` | AWS region (fallback) | `us-east-1` | No |
| `APP_BASE_URL` | Base URL for verification links | - | Yes |

**Lambda Configuration:**
These are automatically injected via Terraform (`lambda.tf`):
```hcl
environment {
  variables = {
    SES_REGION     = "us-east-1"
    SES_FROM_EMAIL = "contato@takeseat.me"
    APP_BASE_URL   = "https://takeseat.me"
  }
}
```

---

## Rollback Procedures

### If Email Sending Fails After Deployment

1. **Check CloudWatch Logs** for error details
2. **Verify SES Identity Status** (see "Checking SES Status")
3. **Temporary Workaround**: Disable email verification requirement
   - Comment out email sending in `auth.service.ts`
   - Allow users to login without verification (NOT recommended for production)
4. **Revert Terraform Changes**:
   ```bash
   cd infra/terraform
   git revert <commit-hash>
   terraform apply
   ```

### If DNS Changes Break Email

1. **Check DNS Propagation**: `dig` commands above
2. **Revert Route53 Changes**:
   ```bash
   terraform state rm aws_route53_record.ses_dkim[0]
   terraform state rm aws_route53_record.ses_dkim[1]
   terraform state rm aws_route53_record.ses_dkim[2]
   terraform apply
   ```
3. **Wait for DNS TTL** (600 seconds for DKIM records)

---

## Maintenance

### Rotating DKIM Keys (Recommended Annually)

```bash
aws sesv2 put-email-identity-dkim-signing-attributes \
  --email-identity takeseat.me \
  --signing-attributes-origin AWS_SES \
  --signing-attributes NextSigningKeyLength=RSA_2048_BIT \
  --region us-east-1
```

### Monitoring Reputation

Check bounce/complaint rates monthly:

```bash
aws sesv2 get-account --region us-east-1
```

**Healthy Thresholds:**
- Bounce rate: < 5%
- Complaint rate: < 0.1%

---

## Support Contacts

- **AWS SES Support**: https://console.aws.amazon.com/support/home
- **Internal DevOps**: Check team documentation
- **DNS Issues**: Contact domain registrar or Route53 support

---

## References

- [AWS SES Developer Guide](https://docs.aws.amazon.com/ses/latest/dg/)
- [SES API Reference (v2)](https://docs.aws.amazon.com/ses/latest/APIReference-V2/)
- [DKIM Best Practices](https://docs.aws.amazon.com/ses/latest/dg/send-email-authentication-dkim.html)
- [SPF/DMARC Setup](https://docs.aws.amazon.com/ses/latest/dg/send-email-authentication-spf.html)
