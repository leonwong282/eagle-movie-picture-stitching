---
sidebar_position: 2
title: "Security Policy"
description: How to report security vulnerabilities
keywords: [security, vulnerability, reporting, policy]
---

# 🔒 Security Policy

## Supported Versions

We actively maintain and provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | ✅ Yes             |
| < 1.0   | ❌ No              |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

### 🚨 For Security Issues

:::danger Important
**DO NOT** create a public GitHub issue for security vulnerabilities.
:::

Instead, please report security issues privately:

1. **Email**: Send details to [leonwong282@gmail.com](mailto:leonwong282@gmail.com)
2. **Subject**: Include "SECURITY" in the email subject
3. **Details**: Provide as much information as possible

### 📋 What to Include

When reporting a security vulnerability, please include:

- **Type of issue** (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- **Full paths** of source file(s) related to the manifestation of the issue
- **Location** of the affected source code (tag/branch/commit or direct URL)
- **Special configuration** required to reproduce the issue
- **Step-by-step instructions** to reproduce the issue
- **Proof-of-concept or exploit code** (if possible)
- **Impact** of the issue, including how an attacker might exploit it

### 🕒 Response Timeline

- **Initial Response**: Within 48 hours
- **Investigation**: Within 1 week
- **Fix and Disclosure**: Coordinated with reporter

### 🏆 Recognition

We appreciate security researchers and will:

- Acknowledge your contribution (unless you prefer to remain anonymous)
- Keep you updated on the progress
- Credit you in our security advisories (with your permission)

## Security Best Practices

### For Contributors

- **Dependencies**: Keep dependencies up to date
- **Code Review**: All code changes require review
- **Testing**: Include security tests when applicable
- **Secrets**: Never commit secrets, API keys, or credentials

### For Users

- **Updates**: Always use the latest supported version
- **Configuration**: Follow security configuration guidelines
- **Environment**: Use secure deployment practices
- **Monitoring**: Monitor for security advisories

## Recommended Security Practices

When implementing your project, consider:

- 🔄 **Dependency Scanning**: Enable automated vulnerability detection (e.g., Dependabot)
- 🔍 **Code Analysis**: Set up static security analysis (e.g., CodeQL)
- 🔐 **Access Controls**: Implement proper authentication and authorization
- 🛡️ **Input Validation**: Sanitize all user inputs
- ⚙️ **Secure Defaults**: Use security-first configuration

## Security Resources

- **Vulnerability Database**: [GitHub Advisory Database](https://github.com/advisories)
- **Security Guides**: [GitHub Security Documentation](https://docs.github.com/en/code-security)

## Contact

This project and everyone participating in it is governed by our [Code of Conduct](./code-of-conduct). By participating, you are expected to uphold this code.

---

**Security is everyone's responsibility. Thank you for helping keep our community safe! 🛡️**
