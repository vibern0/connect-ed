#!/usr/bin/env bash

ganache_port=8545
run_with=npm

ganache_running() {
    nc -z localhost "$ganache_port"
}

start_ganache() {
    npm run start:ganache:dev > /dev/null &
    ganache_pid=$!
    echo "Waiting for ganache to launch on port "$ganache_port"..."
    while ! ganache_running; do
        sleep 0.1 # wait for 1/10 of the second before check again
    done
    echo "Ganache launched!"
}

if ganache_running; then
    echo "Ganache instance already running!"
else
    # check flag
    for i in "$@"
    do
        if [[ $i == "--yarn" ]]
            then run_with=yarn
        fi
    done;
    # script starts on root folder
    # ethereum folder
    cd ethereum
    # install dependencies
    if [ "$run_with" == "yarn" ];
        then yarn
        else npm install
    fi
    # starts ganache instance and run in background
    echo "Starting our own ganache instance"
    start_ganache
    # remove build folder
    if [[ -d build/ ]]; then rm -rf build; fi
    # deploy contracts
    npm run deploy:ganache
    # go back to parent folder
    cd ..
    # client folder
    cd client
    # install dependencies
    if [ "$run_with" == "yarn" ];
        then yarn
        else npm install
    fi
    # link contracts
    if [ "$run_with" == "yarn" ];
        then yarn link-contracts
        else npm run link-contracts
    fi
    # start client
    if [ "$run_with" == "yarn" ];
        then yarn start
        else npm run start
    fi
fi
