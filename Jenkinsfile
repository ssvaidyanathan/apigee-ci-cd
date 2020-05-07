pipeline {

    agent {
      dockerfile true
    }

    environment {
        APIGEE_CREDS = credentials('apigee')
        HOME = '.'
        APIGEE_ORG = 'strebel-eval'
    }

    stages {
        stage('Clean') {
            steps {
              script{
                if (env.GIT_BRANCH == "master") {
                    env.APIGEE_DEPLOYMENT_SUFFIX = ""
                    env.APIGEE_PROFILE = "test"
                    env.NORTH_BOUND_API = "strebel-eval-test.apigee.net"
                } else if (env.GIT_BRANCH == "prod") {
                    env.APIGEE_DEPLOYMENT_SUFFIX = ""
                    env.APIGEE_PROFILE = "prod"
                    env.NORTH_BOUND_API = "strebel-eval-prod.apigee.net"
                } else { //feature branches
                    env.APIGEE_DEPLOYMENT_SUFFIX = env.GIT_BRANCH ? "-" + env.GIT_BRANCH : "-jenkins"
                    env.APIGEE_PROFILE = "test"
                    env.NORTH_BOUND_API = "strebel-eval-test.apigee.net"
                }
              }
              sh "mvn clean"
            }
        }
        stage('Static Code Analysis, Unit Test and Coverage') {
            steps {
              script {
                  AUTHOR_EMAIL = sh (
                      script: 'git --no-pager show -s --format=\'%ae\'',
                      returnStdout: true
                ).trim()
              }
              sh "mvn -ntp test -P${env.APIGEE_PROFILE} \
                    -Ddeployment.suffix=${env.APIGEE_DEPLOYMENT_SUFFIX} \
                    -Dcommit=${env.GIT_COMMIT} \
                    -Dbranch=${env.GIT_BRANCH} -Duser.name=${AUTHOR_EMAIL} \
                    -Dapi.northbound.domain=${env.NORTH_BOUND_API}"
            }
        }
        stage('Configurations') {
            steps {
              sh "mvn -ntp apigee-config:keyvaluemaps apigee-config:targetservers apigee-config:caches -P${env.APIGEE_PROFILE} -Dapigee.org=${env.APIGEE_ORG} -Dusername=${APIGEE_CREDS_USR} -Dpassword=${APIGEE_CREDS_PSW} -Dapigee.config.options=update -Dapigee.config.dir=${WORKSPACE}/resources/edge"
            }
        }
        stage('Package proxy bundle') {
            steps { 
              sh "mvn -ntp apigee-enterprise:configure -P${env.APIGEE_PROFILE} -Ddeployment.suffix=${env.APIGEE_DEPLOYMENT_SUFFIX}"
            }
        }
        stage('Deploy proxy bundle') {
            steps {
              sh "mvn -ntp apigee-enterprise:deploy -P${env.APIGEE_PROFILE} -Ddeployment.suffix=${env.APIGEE_DEPLOYMENT_SUFFIX} -Dapigee.org=${env.APIGEE_ORG} -Dusername=${APIGEE_CREDS_USR} -Dpassword=${APIGEE_CREDS_PSW}"
            }
        }
        stage('Functional Test') {
          steps {
            sh "node ./node_modules/cucumber/bin/cucumber.js target/test/integration/features --format json:target/reports.json"
          }
        }
    }

    post { 
        always {
            publishHTML(target: [
                                  allowMissing: false,
                                  alwaysLinkToLastBuild: false,
                                  keepAll: false,
                                  reportDir: "coverage",
                                  reportFiles: 'index.html',
                                  reportName: 'HTML Report'
                                ]
                        )

            step([
                    $class: 'CucumberReportPublisher',
                    fileExcludePattern: '',
                    fileIncludePattern: "**/reports.json",
                    ignoreFailedTests: false,
                    jenkinsBasePath: '',
                    jsonReportDirectory: "target",
                    missingFails: false,
                    parallelTesting: false,
                    pendingFails: false,
                    skippedFails: false,
                    undefinedFails: false
                    ])
        }
    }
}