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
        stage('Clean') {
            steps {
              script{
                if (env.GIT_BRANCH == "master") {
                    env.APIGEE_PREFIX = ""
                    env.APIGEE_PROFILE = "test"
                } else if (env.GIT_BRANCH == "prod") {
                    env.APIGEE_PREFIX = ""
                    env.APIGEE_PROFILE = "prod"
                } else { //feature branches
                    env.APIGEE_PREFIX = "jenkins"
                    env.APIGEE_PROFILE = "test"
                }
              }
              sh "mvn clean"
            }
        }
        stage('Static Code Analysis, Unit Test and Coverage') {
            steps {
              sh "mvn -ntp test -P${env.APIGEE_PROFILE} -Ddeployment.suffix=${env.APIGEE_PREFIX} -Dusername=${APIGEE_CREDS_USR} -Dpassword=${APIGEE_CREDS_PSW} -Dcommit=${env.GIT_COMMIT} -Dbranch=${env.GIT_BRANCH}"
            }
        }
        stage('Package proxy bundle') {
            steps {
              sh "mvn -ntp apigee-enterprise:configure -P${env.APIGEE_PROFILE}"
            }
        }
        stage('Deploy proxy bundle') {
            steps {
              sh "mvn -ntp apigee-enterprise:deploy -P${env.APIGEE_PROFILE} -Dusername=${APIGEE_CREDS_USR} -Dpassword=${APIGEE_CREDS_PSW}"
            }
        }
        stage('Functional Test') {
          steps {
            sh "node ./node_modules/cucumber/bin/cucumber.js target/test/integration/features --format json:target/reports.json"
          }
        }

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