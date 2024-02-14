pipeline {
  agent {
    kubernetes {
      label 'nodejs-pull'
      yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: nodejs
    image: registry.cn-hangzhou.aliyuncs.com/centos-node/nodejs:latest
    command: [\'cat\']
    tty: true
    volumeMounts:
    - name: dockersock
      mountPath: /var/run/docker.sock
  volumes:
    - name: dockersock
      hostPath:
        path: /var/run/docker.sock
'''
    }

  }
  stages {
    stage('拉取代码') {
      agent none
      steps {
        container('nodejs') {
          git(url: 'https://gitee.com/snaril/snaril-web.git', credentialsId: 'snaril-web', branch: 'master', changelog: true, poll: false)
          sh 'ls -al'
        }

      }
    }

    stage('项目编译') {
      agent none
      steps {
        container('nodejs') {
          sh 'node -v'
          sh 'npm i node-sass --sass_binary_site=https://npm.taobao.org/mirrors/node-sass/'
          sh 'npm install --registry https://registry.npm.taobao.org'
          sh 'npm run build .'
          sh 'pwd'
        }

      }
    }

    stage('项目构建') {
      agent none
      steps {
        container('nodejs') {
          sh 'ls -al'
          sh 'pwd'
          sh 'docker build -t snaril-web:latest -f Dockerfile ./'
          sh 'docker ps -af name=snaril-web'
        }

      }
    }

    stage('推送镜像') {
      agent none
      steps {
        container('nodejs') {
          withCredentials([usernamePassword(credentialsId : 'aliyun-docker-registry' ,passwordVariable : 'DOCKER_PASS_VAR' ,usernameVariable : 'DOCKER_USER_VAR' ,)]) {
            sh 'echo "$DOCKER_PASS_VAR" | docker login $REGISTRY -u "$DOCKER_USER_VAR" --password-stdin'
            sh 'docker tag  snaril-web:latest $REGISTRY/$DOCKERHUB_NAMESPACE/snaril-web:SNAPSHOT-$BUILD_NUMBER'
            sh 'docker push  $REGISTRY/$DOCKERHUB_NAMESPACE/snaril-web:SNAPSHOT-$BUILD_NUMBER'
          }

        }

      }
    }

    stage('deploy to dev') {
      steps {
        input(id: 'deploy-to-dev', message: 'deploy to dev?')
        kubernetesDeploy(configs: 'deploy/**', enableConfigSubstitution: true, kubeconfigId: "$KUBECONFIG_CREDENTIAL_ID")
        sh 'ls -al'
      }
    }

  }
  environment {
    DOCKER_CREDENTIAL_ID = 'dockerhub-id'
    GITHUB_CREDENTIAL_ID = 'github-id'
    KUBECONFIG_CREDENTIAL_ID = 'snaril-web-config'
    REGISTRY = 'registry.cn-hangzhou.aliyuncs.com'
    DOCKERHUB_NAMESPACE = 'snaril'
    GITHUB_ACCOUNT = 'kubesphere'
    APP_NAME = 'snaril-web'
  }
  parameters {
    string(name: 'TAG_NAME', defaultValue: '', description: '')
  }
}