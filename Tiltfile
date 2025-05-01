# Enable live updates
allow_k8s_contexts('docker-desktop')

# Use Docker Compose
docker_compose(['docker-compose.yml'])

# Watch essential files
watch_file('docker-compose.yml')
watch_file('client/package.json')
watch_file('server/package.json')
watch_file('worker/package.json')

# Configure resources
dc_resource('client')
dc_resource('server')
dc_resource('worker')
dc_resource('rabbitmq')
dc_resource('redis') 