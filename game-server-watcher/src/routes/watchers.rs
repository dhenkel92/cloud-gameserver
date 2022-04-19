use crate::routes::types::{create_watcher_links, JsonResponseLinks};
use crate::watcher_config::WatcherConfig;
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
    clap_config: &State<crate::Args>,
) -> Json<Vec<AvailableWatcher>> {
    println!("{:?}", config);
    let avail = config
        .watchers
        .iter()
        .map(|watch| AvailableWatcher {
            data: AvailableWatcherData {
                name: watch.name.clone(),
                links: create_watcher_links(&clap_config.base_url, &watch.name),
            },
            links: HashMap::new(),
        })
        .collect::<Vec<AvailableWatcher>>();
    Json(avail)
}
