# Secrets Management

Bitflow Nova stores secrets in AWS Secrets Manager for sandbox and production environments. Local development loads secrets from the `.env` file.

## Naming strategy

```
/bitflow/{environment}/{university}/{service}/{key}
```

Examples:

- `/bitflow/sandbox/mvp/app/app_key`
- `/bitflow/sandbox/mvp/app/aws_access_key_id`
- `/bitflow/production/college123/db/password`

## Provisioning

1. Add secrets using the AWS Console or CLI:
   ```bash
   aws secretsmanager create-secret \
     --name /bitflow/sandbox/mvp/app/app_key \
     --secret-string "base64-encoded-key"
   ```
2. Grant read access to the GitHub Actions IAM role and ECS/EKS task roles.
3. Use the deployment pipeline to fetch and template environment files before runtime.

## Local overrides

- Copy `.env.example` to `.env` and set developer-specific credentials.
- Never commit `.env` or credentials to version control (`.gitignore` protects this).

## Rotations

- Database and root secrets rotate every 90 days.
- AWS access keys used by CI should be short-lived via GitHub OIDC; no long-term keys stored locally.
