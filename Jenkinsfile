pipeline {
	agent any

	stages {
		stage('build') {
			steps {
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
			slackSend "Revision ${env.GIT_COMMIT} build ${env.BUILD_NUMBER} succeeded"
		}
		
		failure {
			slackSend "Revision ${env.GIT_COMMIT} build ${env.BUILD_NUMBER} failed"
		}
	}
}