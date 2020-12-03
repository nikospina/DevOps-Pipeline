def BRANCH = ""
pipeline {
    agent {
			node{
					label 'slaves'
				}
            }
	environment {
		XDG_CACHE_HOME = '/tmp/.cache'
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
                        withDockerContainer("node") { sh "npm set strict-ssl false && npm install && npm test" }//chmod 777 node_modules && npx nyc@latest --reporter=lcov --reporter=cobertura --reporter=text-summary mocha test --reporter mocha-junit-reporter"}
                        //sh 'ls -la'
						//sh "npm set strict-ssl false && npm install && npm test"
                        echo '>>> Publish Results'
                        cobertura autoUpdateHealth: false, autoUpdateStability: false, coberturaReportFile: 'coverage/*coverage.xml', conditionalCoverageTargets: '70, 0, 0', failUnhealthy: false, failUnstable: false, lineCoverageTargets: '80, 0, 0', maxNumberOfBuilds: 0, methodCoverageTargets: '80, 0, 0', onlyStable: false, sourceEncoding: 'ASCII'
                        junit skipPublishingChecks: false, testResults: 'test-results.xml'
						
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
                        echo 
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
