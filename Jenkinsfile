def BRANCH = ""
pipeline {
    agent {
			node{
					label 'slaves'
				}
            }
	environment {
		XDG_CACHE_HOME = '/tmp/.cache'
		ECR_URL = '125277160564.dkr.ecr.us-east-1.amazonaws.com/cobis/cwc-cloud'
		AWS_ACCESS_KEY_ID = "ASIAR2KYZYR2KP4LGSBH"
        AWS_SECRET_ACCESS_KEY = "8wnz18bhgB3hkMWFhxWld9L37+nU9yBSMZOm8tzq"
		AWS_SESSION_TOKEN = "IQoJb3JpZ2luX2VjEEEaCXVzLWVhc3QtMSJIMEYCIQDsnu7mSMPvgUZLSF/nXZ9cMJVsNSKnibHxhCsaGtsM0AIhAJaITaFDU71WRDyTBwhWw7PEdXGKMvl/cKbvbg+PMF4PKp0DCMr//////////wEQARoMMTI1Mjc3MTYwNTY0IgzHYQjyqS6JYgFkIL0q8QLrjebu0ZAP5wuN7Yq2IOSAPvo0dLKcRpTc7l8AKF+IF3SLi+BgIBmIHyz4UdHD9lOcfsA6rTcT2KVFOmxm7DfhzOzJoP4gr9DxGYlSC4gxiObJfX7f6a68s3oNSFR5AZ98t9zt+PiQT9CG627lqijAjN1yAsi9GUg+pFZLuAaL8GK4mRAJRHSkxWJuoVWeLnLtdI2oiU1XL7pDWmPS7AgoDY1RY1tXFv5u5bubw+gyp8QDQWEALilzvYehGRaIFmmWJ7cKrYg8UFhzAxeXnqVKxGlzX5hmnb6bgOVnzUU2oCFAESu9p4GP0KGwPqFvssPHIv99uNpajx1qJiL6zE6agD8/yQRIUcxbKADReaEGargusVxVaK6TCWx18n5UhZmyrJNI1vcXn+gYr8pgezJ0CRt1ky006FFkVruebAfQSeYF7EnPpCLxIMK694Vk/+tPUY/5EnHIAfFeUWunhStwvKRVCO3KfIWgd3Zk4OSea30wxIem/gU6pQE4jreVNgnaa2dYjjIw0Ckkr2MgvZaAhXyzTwFaHIkgbxE8ck+r4a+R3MU5wNp1h1daDRdqGsVTlYokaEqwnt534SQRh2k36ElAn3nb1XwC5DmuCCCenW/xVVuoOpI6mnKLqm2VjpFWmHHZk/VRUuZG6/04pJRZOdHSelswG4qXV7h90M3A2cL5xWxwg0gRbAk9MAW78qzmR+ZAAL9kWQQPhRqDPfw="
	}
    stages{
        stage('Checkout') {
			agent any
            steps{
                script{
                    try{
                        echo 'checkout repo'
                        //git branch: 'develop', url: 'https://github.com/nikospina/DevOps-Pipeline'
                    }
                    catch (e) {
                        echo 'Something failed, I should sound the klaxons!'
                        throw e
                    }
                }
            }
        }
        stage('Build') {
            steps{
                script{
                    try {
                        echo '>>> Build'
						//sh "mvn -v"
                    }
                    catch (e) {
                        echo 
                    }
                }
            }
        }
        stage('Test') {
            steps{
                script{                    
                    try {
                        echo '>>> Test'
                        withDockerContainer("node") { sh "npm set strict-ssl false && npm install && npm test" }
						
                        echo '>>> Publish Results'
						
                        cobertura autoUpdateHealth: false, autoUpdateStability: false, coberturaReportFile: 'coverage/*coverage.xml', conditionalCoverageTargets: '70, 0, 0', failUnhealthy: false, failUnstable: false, lineCoverageTargets: '80, 0, 0', maxNumberOfBuilds: 0, methodCoverageTargets: '80, 0, 0', onlyStable: false, sourceEncoding: 'ASCII'
                        junit skipPublishingChecks: false, testResults: 'test-results.xml'
						
						echo '>>> Publish Results in TFS'
						
						step([$class: 'TeamCollectResultsPostBuildAction', 
							requestedResults: [
								[includes: 'test-results.xml', teamResultType: 'JUNIT'],
								[includes: 'coverage/*coverage.xml', teamResultType: 'COBERTURA']
							]
						])
                    }
                    catch (e) {
                        echo 'Something failed, I should sound the klaxons!'
                        throw e
                    }
                }
            }
        }
        stage('docker build') {
            steps{
                script{
                    try {
                        echo '>>> Build image'
                        //withDockerContainer("docker") { }
                        sh "docker build -t darkaru/npm-test-example:v1 ."
                    }
                    catch (e) {
                        echo 'Something failed, I should sound the klaxons!'
                        throw e
                    }
                }
            }
        }
        stage('Trivy scan') {
            steps{
                script{
                    try {
                        echo '>>> Scan image'
                        //withDockerContainer("darkaru/trivy:v1") { sh "trivy darkaru/npm-test-example:v1" }
						echo '>>> Scan for critical vulnerabilities'
						sh "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v $HOME/Library/Caches:/root/.cache/ aquasec/trivy --exit-code 0 --severity CRITICAL darkaru/npm-test-example:v1"
						echo '>>> Scan for medium and high vulnerabilities'
						sh "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v $HOME/Library/Caches:/root/.cache/ aquasec/trivy --exit-code 0 --severity MEDIUM,HIGH darkaru/npm-test-example:v1"
                    }
                    catch (e) {
                        echo 'Something failed, I should sound the klaxons!'
                        throw e
                    }
                }
            }
        }
		stage('Docker push') {
			steps{
				script{
					try {
						echo '>>> Docker image push'
					}
					catch (e){
						echo 'Something failed, I should sound the klaxons!'
                        throw e
					}
				}
			}
		}
		stage('Post image scan') {
			steps{
				script{
					try {
						echo '>>> Scan image'
						withDockerContainer("darkaru/aws-cli-kubectl:v4") {
							
							sh 'aws ecr start-image-scan --registry-id 125277160564 --repository-name cobis/cwc-cloud --image-id imageTag=java8_tomcat9_v1.0.0_CWC3.3.0.BETA_DSG7.2.0.2019-BETA_PUX2.0.2_WBC3.2.0 --output json | tee ecr_start_scan_${BUILD_NUMBER}.txt' 
							
							sh 'aws ecr describe-image-scan-findings --registry-id 125277160564 --repository-name cobis/cwc-cloud --image-id imageTag=java8_tomcat9_v1.0.0_CWC3.3.0.BETA_DSG7.2.0.2019-BETA_PUX2.0.2_WBC3.2.0 --output json | tee ecr_scanResult_${BUILD_NUMBER}.txt'
						}				
					}
					catch (e){
						echo 'Something failed, I should sound the klaxons!'
                        throw e
					}
				}
			}
		}
        stage('Update Data Base') {
            steps{
                script{
                    try {
                        echo '>>> Update Data Base'
                        //withDockerContainer("liquibase/liquibase:latest") {
                        //    sh 'export PATH=/liquibase:$PATH && liquibase --logLevel=debug --url=jdbc:mysql://host.docker.internal:3306/tickets?serverTimezone=UTC --changeLogFile=dbchangelog.xml --username=root --password=admin update'
                        //}
                    }
                    catch (e) {
                        echo 'Something failed, I should sound the klaxons!'
                        throw e
                    }
                }
            }
        }
        stage('Deploy Dev') {
            when {
                not {
                    anyOf {
                        branch 'PRD';
                        branch 'QA'
                    }
                }
            }
            steps{
                script{
                    try {
                        echo 'Deploying in dev'
                    }
                    catch (e) {
                        echo 'Something failed, I should sound the klaxons!'
                        throw e
                    }
                }
            }
        }
        stage('Deploy QA') {
            when {
                branch 'QA';
            }
            steps{
                script{
                    try {
                        echo 'Deploying in QA'
                    }
                    catch (e) {
                        echo 'Something failed, I should sound the klaxons!'
                        throw e
                    }
                }
            }
        }
        stage('Deploy PRD') {
            when {
                branch 'PRD';
            }
            steps{
                script{
                    try {
                        echo 'Deploying in PRD'
                    }
                    catch (e) {
                        echo 'Something failed, I should sound the klaxons!'
                        throw e
                    }
                }
            }
        }
        stage('QA Test') {
            when {
                branch 'QA'
            }
            steps {
                script{
                    try {
                        echo 'QA Testing'
                    }
                    catch (e) {
                        echo 'Something failed, I should sound the klaxons!'
                        throw e
                    }
                }
            }
        }
    }
}
