pipeline {
    agent any

    tools {
        nodejs 'node26' 
    }

    // Variables d'environnement pour réutiliser les noms d'images facilement
    environment {
        DOCKER_HUB_USER = "sadouzz"
        BACKEND_IMAGE = "${DOCKER_HUB_USER}/scores-backend:latest"
        FRONTEND_IMAGE = "${DOCKER_HUB_USER}/scores-frontend:latest"
    }

    stages {
        stage('Build & Test Backend') {
            steps {
                dir('scores') {
                    // On suppose que Maven (ou le wrapper mvnw) est installé sur le serveur Jenkins
                    // Sous Windows, ce sera mvnw.cmd, sous Linux ./mvnw
                    script {
                        if (isUnix()) {
                            sh './mvnw clean package'
                        } else {
                            bat 'mvnw.cmd clean package'
                        }
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('scores-front') {
                    // On suppose que Node.js et npm sont installés sur le serveur Jenkins
                    script {
                        if (isUnix()) {
                            sh 'npm ci'
                            sh 'npm run build'
                        } else {
                            bat 'npm ci'
                            bat 'npm run build'
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    if (isUnix()) {
                        sh "docker build -t ${BACKEND_IMAGE} ./scores"
                        sh "docker build -t ${FRONTEND_IMAGE} ./scores-front"
                    } else {
                        bat "docker build -t ${BACKEND_IMAGE} ./scores"
                        bat "docker build -t ${FRONTEND_IMAGE} ./scores-front"
                    }
                }
            }
        }

        // --- LES ÉTAPES SUIVANTES SONT COMMENTÉES POUR L'INSTANT ---
        // Elles nécessitent de configurer des identifiants (Credentials) dans Jenkins

        
        stage('Push Docker Images') {
            steps {
                script {
                    // 'docker-hub-credentials' doit être ajouté dans les "Credentials" de Jenkins
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                        if (isUnix()) {
                            sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"
                            sh "docker push ${BACKEND_IMAGE}"
                            sh "docker push ${FRONTEND_IMAGE}"
                        } else {
                            bat "echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin"
                            bat "docker push ${BACKEND_IMAGE}"
                            bat "docker push ${FRONTEND_IMAGE}"
                        }
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // 'kubeconfig-credentials' doit contenir ton fichier de configuration Kubernetes
                    withKubeConfig([credentialsId: 'kubeconfig-credentials']) {
                        if (isUnix()) {
                            sh 'kubectl apply -f k8s/'
                        } else {
                            bat 'kubectl apply -f k8s/'
                        }
                    }
                }
            }
        }
        
    }
}
