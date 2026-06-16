pipeline {
  agent any

  environment {
    IMAGE    = "abhayraj01/devops-learn-node-app"
    EC2_IP   = "51.21.198.177"
    EC2_USER = "ubuntu"
  }

  stages {

    stage('Checkout') {
      steps {
        git branch: 'main',
            credentialsId: 'github-token',
            url: 'https://github.com/abhayraj620285-afk/Devops-learn-Node-app'
      }
    }

    stage('Install and test') {
      steps {
        sh 'npm install'
        sh 'npm test'
      }
    }

    stage('Build Docker image') {
      steps {
        sh "docker build -t ${IMAGE}:${BUILD_NUMBER} ."
        sh "docker tag ${IMAGE}:${BUILD_NUMBER} ${IMAGE}:latest"
      }
    }

    stage('Push to Docker Hub') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
          sh "docker push ${IMAGE}:${BUILD_NUMBER}"
          sh "docker push ${IMAGE}:latest"
        }
      }
    }

    stage('Deploy to EC2') {
      steps {
        sshagent(['ec2-ssh']) {
          sh """
            ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} '
              docker pull ${IMAGE}:latest &&
              docker stop myapp 2>/dev/null || true &&
              docker rm   myapp 2>/dev/null || true &&
              docker run -d --name myapp \
                --restart=always \
                -p 80:3000 \
                ${IMAGE}:latest
            '
          """
        }
      }
    }

  }

  post {
    success { echo 'Deployed successfully!' }
    failure { echo 'Pipeline failed — check logs above' }
  }
}
