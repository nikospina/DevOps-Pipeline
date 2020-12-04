pipeline {
    agent {
			node{
					label 'slaves'
				}
            }
	environment {
		VAR = 'A'
		short_commit_id = ""
	}
    stages{
        stage('init') {
			agent any
            steps{
                script{
                    try{
                        echo '>>> Init'
                        //git branch: 'develop', url: 'https://github.com/nikospina/DevOps-Pipeline'
						short_commit_id = sh (script: 'git rev-parse --short HEAD', returnStdout: true).trim()
						echo "git short commit id: ${short_commit_id}"
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
                        //withDockerContainer("node") { sh "npm set strict-ssl false && npm install && npm test" }
						
                        echo '>>> Publish Results'
						
                        //cobertura autoUpdateHealth: false, autoUpdateStability: false, coberturaReportFile: 'coverage/*coverage.xml', conditionalCoverageTargets: '70, 0, 0', failUnhealthy: false, failUnstable: false, lineCoverageTargets: '80, 0, 0', maxNumberOfBuilds: 0, methodCoverageTargets: '80, 0, 0', onlyStable: false, sourceEncoding: 'ASCII'
                        //junit skipPublishingChecks: false, testResults: 'test-results.xml'
						//
						//echo '>>> Publish Results in TFS'
						//
						//step([$class: 'TeamCollectResultsPostBuildAction', 
						//	requestedResults: [
						//		[includes: 'test-results.xml', teamResultType: 'JUNIT'],
						//		[includes: 'coverage/*coverage.xml', teamResultType: 'COBERTURA']
						//	]
						//])
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
                        sh "docker build -t app-test ."
						echo '>>> Tag image'
						sh "docker tag app-test:latest 225742832627.dkr.ecr.us-east-2.amazonaws.com/app-test:${short_commit_id}.B${BUILD_NUMBER}"
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
						//sh "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v $HOME/Library/Caches:/root/.cache/ aquasec/trivy --exit-code 0 --severity CRITICAL 225742832627.dkr.ecr.us-east-2.amazonaws.com/app-test:${short_commit_id}.B${BUILD_NUMBER}"
						echo '>>> Scan for medium and high vulnerabilities'
						//sh "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v $HOME/Library/Caches:/root/.cache/ aquasec/trivy --exit-code 0 --severity MEDIUM,HIGH 225742832627.dkr.ecr.us-east-2.amazonaws.com/app-test:${short_commit_id}.B${BUILD_NUMBER}"
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
						echo '>>> Docker login'
						sh "aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 225742832627.dkr.ecr.us-east-2.amazonaws.com"
						echo '>>> Docker image push'
						sh "docker images"
						sh "docker push 225742832627.dkr.ecr.us-east-2.amazonaws.com/app-test:${short_commit_id}.B${BUILD_NUMBER}"
						
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
						sh "aws ecr start-image-scan --registry-id 225742832627 --repository-name app-test --image-id imageTag=${short_commit_id}.B${BUILD_NUMBER} --output text | tee ecr_start_scan_${BUILD_NUMBER}.txt"
						
						sh "aws ecr describe-image-scan-findings --registry-id 225742832627 --repository-name app-test --image-id imageTag=${short_commit_id}.B${BUILD_NUMBER} --output text | tee ecr_scanResult_${BUILD_NUMBER}.txt"			
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
