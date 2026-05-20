# Troubleshooting Guide

## Overview
This document provides debugging steps, logs verification procedures, and resolution actions for recurring infrastructure and application anomalies.

## Responsibilities
- Diagnose failed messaging deliveries.
- Resolve database connection pool exhaustion.
- Debug web layouts and scroll behaviors.

## Architecture / Flow
1. **Detect Issue**: Alert triggers or logs register error stack traces.
2. **Review Logs**: Query CloudWatch logs or local console terminal buffers.
3. **Verify Settings**: Check configuration parameters and database records.
4. **Apply Fix**: Execute runbook commands to recover service state.

## Rules
- **Access Privilege Logs**: Never print raw user credentials, unmasked JWTs, or credit card numbers in diagnostic output files or application logs.

## Edge Cases
- **Z-API Gateway Disconnected**: If guests are not receiving text notifications:
  - Check the Z-API dashboard instance state.
  - Scan the WhatsApp Web link QR code if the device has lost connection.
  - Verify that the API token has not expired.
- **Database Connection Pool Exhaustion**: If API requests return HTTP 500 with `PrismaClientInitializationError`:
  - Verify that database connections are properly released.
  - Check if the Lambda function concurrency limit has exceeded the Aurora cluster's max connection capacity.
  - Increase the connection limit by appending `?connection_limit=15` to the `DATABASE_URL` parameter.

## Technical Notes
- Tail Lambda execution logs using the AWS CLI command:
  ```bash
  aws logs tail /aws/lambda/takeseat-api-prod --follow --region us-east-1
  ```

## Related Documents
- [Email Service Runbook](../guides/email-service-runbook.md)
- [Local Setup Guide](../setup/local-setup.md)
