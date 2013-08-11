#!/bin/bash
cd server/;
if [ ! -f statstomaps ]; then
        mkdir statstomaps;
fi
java -jar statstomaps.jar statstomaps dumpimage;
mv statstomaps/dumped_map_image.png ../res
