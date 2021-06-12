#![cfg_attr(feature = "strict", deny(warnings))]

mod net;
mod routes;
mod watcher_config;

#[macro_use]
extern crate rocket;

use crate::routes::{watcher_details::watcher_details, watchers::watchers};
use crate::watcher_config::{load_watcher_config, WatcherConfig};
use clap::{load_yaml, App, ArgMatches};
use rocket::figment::Figment;
use rocket::{Build, Rocket};
use std::error::Error;

fn rocket(
    figment: &Figment,
    watcher_config: &WatcherConfig,
    clap_config: &ArgMatches,
) -> Rocket<Build> {
    rocket::custom(figment)
        .manage(watcher_config.clone())
        .manage(clap_config.clone())
        .mount("/", routes![watchers, watcher_details])
}

#[rocket::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let clap_config = load_yaml!("clap-config.yml");
    let matches = App::from(clap_config)
        .version(clap::crate_version!())
        .author(clap::crate_authors!())
        .about(&*("\n".to_owned() + clap::crate_description!()))
        .get_matches();

    println!("matches: {:?}", matches);

    let port = matches.value_of_t::<u32>("port");
    if let Err(e) = port {
        panic!("{:?}", e);
    }
    let port = port.unwrap();

    let figment = rocket::Config::figment()
        .merge(("address", matches.value_of("address").unwrap()))
        .merge(("port", port));

    let config_path = matches.value_of("config-path").unwrap();
    let watcher_config = load_watcher_config(config_path)?;
    println!("watcher config: {:?}", watcher_config);

    if let Err(e) = rocket(&figment, &watcher_config, &matches).launch().await {
        println!("Rocket error: {:?}", e);
        panic!("Whoops rocket didn't launch")
    }

    Ok(())
}
