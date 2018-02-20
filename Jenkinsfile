pipeline {
	agent any

	stages {
		stage('build') {
			steps {
				slackSend "Branch: ${env.GIT_BRANCH}, Revision: ${env.GIT_COMMIT}, Build: ${env.BUILD_NUMBER} started"
				sh 'npm install'
				dir('TP_webApp/TP_webApp') {
					sh 'dotnet build TP_webApp.csproj'
					sh '../../node_modules/.bin/webpack --config ../../webpack.config.js'
				}
			}
		}
	}
	
	post {
		success {
			slackSend "Branch: ${env.GIT_BRANCH}, Revision: ${env.GIT_COMMIT}, Build: ${env.BUILD_NUMBER} succeeded"
		}
		
		failure {
			slackSend "Branch: ${env.GIT_BRANCH}, Revision: ${env.GIT_COMMIT}, Build: ${env.BUILD_NUMBER} failed"
		}
	}
}