#!/bin/bash
export POSTGRES_USER=${POSTGRES_USER:-'postgres'}
export POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-'postgres'}
export LEDGER_HOST=${HOST_IP:-'localhost'}
export API_IMAGE=${API_IMAGE:-'central-ledger'}
export ADMIN_IMAGE=${ADMIN_IMAGE:-'central-ledger-admin'}
export CLEDG_HOSTNAME='http://central-ledger'
export CLEDG_EXPIRES_TIMEOUT=0
FUNC_TEST_CMD=${FUNC_TEST_CMD:-"tape 'test/functional/**/*.test.js' | tap-xunit > ./test/results/tape-functional.xml"}
docker_compose_file=$1
docker_functional_compose_file=$2
env_file=$3

#create a directory for test results
mkdir ./test/results

if [ $# -ne 3 ]; then
    echo "Usage: $0 docker-compose-file docker-functional-compose-file env-file"
    exit 1
fi

fpsql() {
	docker run --rm -i \
		--net centralledger_back \
		--entrypoint psql \
		-e PGPASSWORD=$POSTGRES_PASSWORD \
		"postgres:9.4" \
    --host postgres \
		--username $POSTGRES_USER \
    --dbname postgres \
		--quiet --no-align --tuples-only \
		"$@"
}

is_psql_up() {
    fpsql -c '\l' > /dev/null 2>&1
    # fpsql -c '\l'
}

fcurl() {
	docker run --rm -i \
		--net centralledger_back \
		--entrypoint curl \
		"jlekie/curl:latest" \
        --output /dev/null --silent --head --fail \
		"$@"
}

is_api_up() {
    # curl --output /dev/null --silent --head --fail http://${LEDGER_HOST}:3000/health
    fcurl "http://centralledger_central-ledger_1:3000/health?"
}

is_admin_up() {
    # curl --output /dev/null --silent --head --fail http://${LEDGER_HOST}:3001/health
    fcurl "http://centralledger_central-ledger-admin_1:3001/health?"
}

run_test_command()
{
  eval "$FUNC_TEST_CMD"
}

shutdown_and_remove() {
  docker-compose -p centralledger -f $docker_compose_file -f $docker_functional_compose_file stop
}

>&2 echo "Loading environment variables"
. $env_file

>&2 echo "Postgres is starting"
docker-compose -p centralledger -f $docker_compose_file -f $docker_functional_compose_file up -d postgres

until is_psql_up; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - creating functional database"
fpsql <<'EOSQL'
    DROP DATABASE IF EXISTS "central_ledger_functional";
	  CREATE DATABASE "central_ledger_functional";
EOSQL

>&2 printf "Central-ledger is building ..."
docker-compose -p centralledger -f $docker_compose_file -f $docker_functional_compose_file up -d central-ledger

>&2 printf "Central-ledger is starting ..."
until is_api_up; do
  >&2 printf "."
  sleep 5
done

>&2 echo " done"

>&2 printf "Central-ledger-admin is building ..."
docker-compose -p centralledger -f $docker_compose_file -f $docker_functional_compose_file up -d central-ledger-admin

>&2 printf "Central-ledger-admin is starting ..."
until is_admin_up; do
  >&2 printf "."
  sleep 5
done

>&2 echo " done"

>&2 echo "Functional tests are starting"
run_test_command
test_exit_code=$?

if [ "$test_exit_code" != 0 ]
then
  docker logs centralledger_central-ledger_1
fi

shutdown_and_remove

exit "$test_exit_code"
