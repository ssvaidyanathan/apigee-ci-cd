pipeline {
    parameters {
       choice(name: 'env', choices: ['test', 'prod'], description: 'Pick environment')
    }

    agent {
      dockerfile true
    }

    environment {
       HOME = '.'
    }

    stages {

        stage('Maven Version') {
            steps {
                sh "mvn --version"
                sh "echo $GIT_BRANCH"
            }
        }
        stage('Node Version') {
            steps {
                sh "node -v"
            }
        }
    }
}