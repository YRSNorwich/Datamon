#!/bin/bash
cd server/;
java -jar statstomaps.jar statstomaps dumpimage;
mv statstomaps/dumped_map_image.png ../res
