pipeline {
  agent any

  environment {
    IMAGE     = "abhayraj01/devops-learn-node-app"
    NAMESPACE = "devops-project3"
  }

  stages {

    stage('Checkout') {
      steps {
        git branch: 'main',
            credentialsId: 'github-token',
            url: 'https://github.com/abhayraj620285-afk/Devops-learn-Node-app'
      }
    }

    stage('Build and push Docker image') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
          sh "docker buildx build --platform linux/amd64,linux/arm64 -t ${IMAGE}:${BUILD_NUMBER} -t ${IMAGE}:latest --push ."
          sh 'docker logout'
        }
      }
    }

    stage('Load image into minikube') {
      steps {
        sh "minikube image load ${IMAGE}:latest"
      }
    }

    stage('Deploy with Helm') {
      steps {
        sh """
          helm upgrade myapp ./myapp-chart \
            --namespace ${NAMESPACE} \
            --set image.tag=${BUILD_NUMBER} \
            --set image.pullPolicy=Never
        """
      }
    }

    stage('Verify deployment') {
      steps {
        sh "kubectl rollout status deployment/myapp -n ${NAMESPACE}"
      }
    }

  }

  post {
    success { echo 'Deployed successfully to minikube!' }
    failure { echo 'Pipeline failed — check logs above' }
  }
}
