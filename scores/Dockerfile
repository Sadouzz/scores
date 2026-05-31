# Étape 1 : Build avec Maven Wrapper
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app
COPY . .

# Rendre mvnw exécutable
RUN chmod +x mvnw

# Build du projet
RUN ./mvnw clean package -DskipTests

# Étape 2 : Exécution
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
