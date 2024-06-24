### Building docker image
```
aws ecr get-login-password --region me-south-1 | docker login --username AWS --password-stdin 827830277284.dkr.ecr.me-south-1.amazonaws.com

docker build -t 827830277284.dkr.ecr.me-south-1.amazonaws.com/nft-marketplace-be:v2.1 .
docker push 827830277284.dkr.ecr.me-south-1.amazonaws.com/nft-marketplace-be:v2.1
```