(
    docker build ./ --tag "$npm_package_config_webcube_staticserver_container:production"
) && (
    docker push $npm_package_config_webcube_staticserver_container
)
