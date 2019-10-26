pipeline {
    parameters {
       choice(name: 'env', choices: ['test', 'prod'], description: 'Pick environment')
    }

    agent {
      dockerfile true
    }

    environment {
        APIGEE_CREDS = credentials('apigee')
        HOME = '.'
    }

    stages {

        stage('Maven Version') {
            steps {
                sh "mvn --version"
                sh "echo ${APIGEE_CREDS_USR}"
                sh "echo ${APIGEE_CREDS_PSW}"
            }
        }
        stage('Node Version') {
            steps {
                sh "node -v"
            }
        }
    }
}