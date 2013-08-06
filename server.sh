#!/bin/bash
if [ "$1" == "start" ]; then
    cd server
    echo "starting server..."
    node index.js >> log.txt&
    if [ "$(pidof node)" != "" ]; then
	echo "Great success!!"
    else
	echo "Oops, looks like an error occured. Probably maybe."
    fi
elif [ "$1" == "stop" ]; then
    echo "stopping server..."
    kill $(pidof node)
    if [ "$(pidof node)" == "" ]; then
	echo "Great success!!"
    else
	echo "Oops, looks like an error occured. Probably maybe."
    fi
elif [ "$1" == "check" ]; then
    if [ "$(pidof node)" != "" ]; then
	echo "Server is running"
    else
	echo "Server is not running"
    fi
else
    echo "Possible arguments are 'start', 'stop' and 'check'"
fi
