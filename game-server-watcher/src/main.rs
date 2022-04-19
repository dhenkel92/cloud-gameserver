#![cfg_attr(feature = "strict", deny(warnings))]

mod net;
mod routes;
mod watcher_config;

#[macro_use]
extern crate rocket;

use crate::routes::{watcher_details::watcher_details, watchers::watchers};
use crate::watcher_config::{load_watcher_config, WatcherConfig};
use clap::{Parser, ArgEnum};
use rocket::figment::Figment;
use rocket::{Build, Rocket};
use std::error::Error;

#[derive(Parser, Debug, Clone)]
#[clap(author, version, about, long_about = None)]
pub struct Args {
    #[clap(long, default_value_t = String::from("127.0.0.1"), help = "IP address to serve on")]
    address: String,
    #[clap(long, default_value_t = 8080, help = "Port on which the Webserver will listen")]
    port: i32,
    #[clap(name = "base-url", long, default_value_t = String::from("http://127.0.0.1:8080"), help = "The base URL used to construct json links")]
    base_url: String,
    #[clap(name = "config-path", long, help = "Path to the configuration file.")]
    config_path: String,
    #[clap(long, arg_enum, default_value_t = ArgsVerbosity::INFO, help = "Log level verbosity.")]
    verbosity: ArgsVerbosity,
}

#[derive(Copy, Clone, PartialEq, Eq, PartialOrd, Ord, ArgEnum, Debug)]
pub enum ArgsVerbosity {
  DEUBG,
  INFO,
  WARN,
  ERROR,
}

fn rocket(figment: &Figment, watcher_config: &WatcherConfig, clap_config: &Args) -> Rocket<Build> {
    rocket::custom(figment)
        .manage(watcher_config.clone())
        .manage(clap_config.clone())
        .mount("/", routes![watchers, watcher_details])
}

#[rocket::main]
async fn main() -> Result<(), Box<dyn Error>> {
    // let clap_config = load_yaml!("clap-config.yml");
    // let matches = App::from(clap_config)
    // .version(clap::crate_version!())
    // .author(clap::crate_authors!())
    // .about(&*("\n".to_owned() + clap::crate_description!()))
    // .get_matches();
    let args: Args = Args::parse();

    println!("matches: {:?}", args);

    let figment = rocket::Config::figment()
        .merge(("address", args.address.clone()))
        .merge(("port", args.port));

    let watcher_config = load_watcher_config(&args.config_path)?;
    println!("watcher config: {:?}", watcher_config);

    if let Err(e) = rocket(&figment, &watcher_config, &args).launch().await {
        println!("Rocket error: {:?}", e);
        panic!("Whoops rocket didn't launch")
    }

    Ok(())
}
