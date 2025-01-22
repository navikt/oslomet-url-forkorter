FROM node:22-alpine AS frontend-build-stage
WORKDIR /frontend
COPY ./frontend .
RUN npm ci
RUN npm run build

FROM maven:3.9.5-eclipse-temurin-21-alpine AS backend-build-stage
WORKDIR /build

COPY backend/src ./src
COPY backend/pom.xml .
COPY --from=frontend-build-stage /frontend/dist ./src/main/resources/public
RUN mvn verify -DskipTests

FROM ncr.sky.nhn.no/dockerhub/library/amazoncorretto:21-alpine
WORKDIR /app

COPY --from=backend-build-stage /build/target/application.jar .

USER 1000
EXPOSE 8080

ENTRYPOINT ["java","-jar","/app/application.jar"]