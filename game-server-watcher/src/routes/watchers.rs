use crate::routes::types::{create_watcher_links, JsonResponseLinks};
use crate::watcher_config::WatcherConfig;
use clap::ArgMatches;
use rocket::serde::{json::Json, Serialize};
use rocket::State;
use std::collections::HashMap;

#[derive(Serialize)]
pub struct AvailableWatcher {
    data: AvailableWatcherData,
    links: JsonResponseLinks,
}

#[derive(Serialize)]
struct AvailableWatcherData {
    name: String,
    links: JsonResponseLinks,
}

#[get("/watchers")]
pub fn watchers(
    config: &State<WatcherConfig>,
    clap_config: &State<ArgMatches>,
) -> Json<Vec<AvailableWatcher>> {
    let base_url = clap_config.value_of("base-url").unwrap();
    println!("{:?}", config);
    let avail = config
        .watchers
        .iter()
        .map(|watch| AvailableWatcher {
            data: AvailableWatcherData {
                name: watch.name.clone(),
                links: create_watcher_links(base_url, &watch.name),
            },
            links: HashMap::new(),
        })
        .collect::<Vec<AvailableWatcher>>();
    Json(avail)
}
