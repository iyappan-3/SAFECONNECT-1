# GovFind - Secure Production Deployment Guide

GovFind must be deployed in a secure cloud or private federal data center environment. This guide details cloud containerization and production hardening checklists.

## 1. Production Security Hardening Checklist

Before exposing GovFind to public networks, implement these security measures:

*   **Enforce HTTPS**: Set up SSL/TLS termination at the ingress controller or load balancer. Reject non-HTTPS requests.
*   **JWT Secret Strength**: Change the development JWT secret to a high-entropy string stored in an external secrets manager (e.g., AWS Secrets Manager, Google Secret Manager, HashiCorp Vault).
*   **Database Isolation**: Place the MySQL instance in a private VPC subnet. Only allow database ingress connections from the Spring Boot container instances.
*   **Bcrypt Strength**: Ensure the PasswordEncoder strength parameter is set to 12 or 13.
*   **XSS & CSP Headers**: Configure your reverse proxy or Spring Security to serve rigid Security headers, including:
    ```http
    Content-Security-Policy: default-src 'self'; frame-ancestors 'none';
    X-Frame-Options: DENY
    X-Content-Type-Options: nosniff
    Referrer-Policy: no-referrer
    ```

---

## 2. Docker Containerization

To deploy GovFind using Docker, utilize the following multi-stage Dockerfiles.

### Backend Dockerfile (`govfind/backend/Dockerfile`)
```dockerfile
# Stage 1: Build JAR
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvc clean package -DskipTests

# Stage 2: Minimal JRE Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/govfind-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### React Web Dockerfile (`govfind/frontend-web/Dockerfile`)
```dockerfile
# Stage 1: Compile static assets
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Lightweight Nginx Server
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 3. Kubernetes Deployment Blueprint

Deploying GovFind to a Managed Kubernetes cluster (e.g., Google GKE, AWS EKS) using a stateless pods configuration:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: govfind-backend
  namespace: govfind
spec:
  replicas: 3
  selector:
    matchLabels:
      app: govfind-backend
  template:
    metadata:
      labels:
        app: govfind-backend
    spec:
      containers:
      - name: backend
        image: gcr.io/state-gov-projects/govfind-backend:v1.0.0
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_DATASOURCE_URL
          value: "jdbc:mysql://mysql-service.govfind.svc.cluster.local:3306/govfind"
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: govfind-secrets
              key: jwt-secret
        resources:
          limits:
            cpu: "1"
            memory: 1Gi
          requests:
            cpu: "200m"
            memory: 512Mi
```
