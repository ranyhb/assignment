** i havent used authentications nethier in the mongo or in the kafka **

How to install
infra:
1) install mongo using the below command:

helm install mymongo oci://registry-1.docker.io/bitnamicharts/mongodb --set auth.enabed=false 

2) install kafka using the the folder in infra_manifest, use the below command:

helm install mykafka . 

(it will deploy 3 kafkas and 1 zookeeper)

3) dockerize each one of the folders:

   a) api-server-managment (port 6000)

   b) customer-backend (port 6555)

   c) my-app-front ( port 3000, nginx 80)

   then upload them to your docker registry (i used a local one)

   ** remmber to change value in the deployment file in the "runonk8s" to the right image from the registry


5) open the web server, fill the form, the see the data live.


** i used ephemeral storage **
