FROM steamcmd/steamcmd:latest

RUN addgroup steamuser \
    && useradd --create-home --shell /bin/bash -g steamuser steamuser

WORKDIR /home/steamuser

RUN steamcmd +force_install_dir /home/steamuser/SatisfactoryDedicatedServer +login anonymous +app_update 1690800 -beta public validate +quit \
    && chown -R steamuser /home/steamuser/SatisfactoryDedicatedServer

USER steamuser
ENV HOME=/home/steamuser
ENV USER=steamuser

ENTRYPOINT ["/bin/bash"]
CMD ["/home/steamuser/SatisfactoryDedicatedServer/FactoryServer.sh", "-Port=7777", "-BeaconPort=15000", "-ServerQueryPort=15777", "-multihome=\"0.0.0.0\""]
